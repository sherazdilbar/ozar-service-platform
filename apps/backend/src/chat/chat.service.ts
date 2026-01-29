import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway,
  ) {}

  async getConversations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { customerId: userId },
          { pro: { userId } },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        pro: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            status: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            read: false,
          },
        });

        return {
          ...conv,
          unreadCount,
          lastMessage: conv.messages[0] || null,
        };
      }),
    );

    return conversationsWithUnread;
  }

  async createConversation(userId: string, dto: CreateConversationDto) {
    // Verify the user is a customer (not a pro)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'CUSTOMER') {
      throw new ForbiddenException('Only customers can initiate conversations with professionals');
    }

    // Verify the customer ID matches the requesting user
    if (dto.customerId !== userId) {
      throw new ForbiddenException('You can only create conversations for yourself');
    }

    // Verify the pro exists
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: dto.proId },
      include: { user: true },
    });

    if (!pro) {
      throw new NotFoundException('Professional not found');
    }

    // Check if conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        customerId: dto.customerId,
        proId: dto.proId,
        bookingId: dto.bookingId,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        customerId: dto.customerId,
        proId: dto.proId,
        bookingId: dto.bookingId,
      },
      include: {
        customer: true,
        pro: {
          include: {
            user: true,
          },
        },
        booking: true,
      },
    });
  }

  async getOrCreateConversation(userId: string, dto: CreateConversationDto) {
    // Verify the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the pro exists
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: dto.proId },
      include: { user: true },
    });

    if (!pro) {
      throw new NotFoundException('Professional not found');
    }

    // For customers, verify they're creating conversation for themselves
    if (user.role === 'CUSTOMER' && dto.customerId !== userId) {
      throw new ForbiddenException('You can only create conversations for yourself');
    }

    // Check if conversation already exists between this customer and pro
    // (regardless of bookingId - we want to reuse the same conversation)
    const existing = await this.prisma.conversation.findFirst({
      where: {
        customerId: dto.customerId,
        proId: dto.proId,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        pro: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        booking: true,
      },
    });

    if (existing) {
      // If a bookingId is provided and the conversation doesn't have one, update it
      if (dto.bookingId && !existing.bookingId) {
        return this.prisma.conversation.update({
          where: { id: existing.id },
          data: { bookingId: dto.bookingId },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            pro: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
            booking: true,
          },
        });
      }
      return existing;
    }

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        customerId: dto.customerId,
        proId: dto.proId,
        bookingId: dto.bookingId,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        pro: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        booking: true,
      },
    });
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customer: true,
        pro: {
          include: {
            user: true,
          },
        },
        booking: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user is part of conversation
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: conversation.proId },
    });

    if (conversation.customerId !== userId && pro?.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 50,
  ) {
    // Verify access
    await this.getConversation(conversationId, userId);

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.message.count({
      where: { conversationId },
    });

    return {
      data: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    dto: SendMessageDto,
  ) {
    // Verify access
    await this.getConversation(conversationId, userId);

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        text: dto.text,
        imageUrl: dto.imageUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit WebSocket event for real-time delivery
    this.chatGateway.emitNewMessage(conversationId, message);

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    // Verify access
    await this.getConversation(conversationId, userId);

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    return { success: true };
  }
}
