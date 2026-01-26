import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
  private typingUsers: Map<string, Set<string>> = new Map(); // conversationId -> Set<userId>

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;

      // Track user's socket connections
      const userSocketIds = this.userSockets.get(client.userId) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(client.userId, userSocketIds);

      // Notify others that user is online
      this.broadcastUserStatus(client.userId, 'online');

      console.log(`User ${client.userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error('WebSocket authentication failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (!client.userId) return;

    // Remove socket from user's connections
    const userSocketIds = this.userSockets.get(client.userId) || [];
    const updatedSocketIds = userSocketIds.filter(id => id !== client.id);
    
    if (updatedSocketIds.length === 0) {
      // User has no more connections, mark as offline
      this.userSockets.delete(client.userId);
      this.broadcastUserStatus(client.userId, 'offline');
    } else {
      this.userSockets.set(client.userId, updatedSocketIds);
    }

    console.log(`User ${client.userId} disconnected socket ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    console.log(`User ${client.userId} joined conversation ${data.conversationId}`);
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    console.log(`User ${client.userId} left conversation ${data.conversationId}`);
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;

    const typingSet = this.typingUsers.get(data.conversationId) || new Set();
    typingSet.add(client.userId);
    this.typingUsers.set(data.conversationId, typingSet);

    // Broadcast to others in conversation
    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId: client.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;

    const typingSet = this.typingUsers.get(data.conversationId);
    if (typingSet) {
      typingSet.delete(client.userId);
      if (typingSet.size === 0) {
        this.typingUsers.delete(data.conversationId);
      }
    }

    // Broadcast to others in conversation
    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId: client.userId,
      isTyping: false,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;

    // Mark messages as read in database
    await this.prisma.message.updateMany({
      where: {
        conversationId: data.conversationId,
        senderId: { not: client.userId },
        read: false,
      },
      data: { read: true },
    });

    // Notify sender that messages were read
    this.server.to(`conversation:${data.conversationId}`).emit('messages_read', {
      conversationId: data.conversationId,
      readBy: client.userId,
    });
  }

  // Called by ChatService when a new message is sent
  emitNewMessage(conversationId: string, message: any) {
    this.server.to(`conversation:${conversationId}`).emit('new_message', {
      conversationId,
      message,
    });

    // Also emit to conversation list for unread count update
    this.emitConversationUpdate(conversationId);
  }

  // Called when conversation is updated
  emitConversationUpdate(conversationId: string) {
    this.server.emit('conversation_updated', {
      conversationId,
    });
  }

  // Broadcast user online/offline status
  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    this.server.emit('user_status', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Get all online users
  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}
