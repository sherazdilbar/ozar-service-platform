"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_gateway_1 = require("./chat.gateway");
let ChatService = class ChatService {
    constructor(prisma, chatGateway) {
        this.prisma = prisma;
        this.chatGateway = chatGateway;
    }
    async getConversations(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
        const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
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
        }));
        return conversationsWithUnread;
    }
    async createConversation(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== 'CUSTOMER') {
            throw new common_1.ForbiddenException('Only customers can initiate conversations with professionals');
        }
        if (dto.customerId !== userId) {
            throw new common_1.ForbiddenException('You can only create conversations for yourself');
        }
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: dto.proId },
            include: { user: true },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional not found');
        }
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
    async getOrCreateConversation(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: dto.proId },
            include: { user: true },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional not found');
        }
        if (user.role === 'CUSTOMER' && dto.customerId !== userId) {
            throw new common_1.ForbiddenException('You can only create conversations for yourself');
        }
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
    async getConversation(conversationId, userId) {
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
            throw new common_1.NotFoundException('Conversation not found');
        }
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: conversation.proId },
        });
        if (conversation.customerId !== userId && pro?.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return conversation;
    }
    async getMessages(conversationId, userId, page = 1, limit = 50) {
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
    async sendMessage(conversationId, userId, dto) {
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
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
        this.chatGateway.emitNewMessage(conversationId, message);
        return message;
    }
    async markAsRead(conversationId, userId) {
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway])
], ChatService);
//# sourceMappingURL=chat.service.js.map