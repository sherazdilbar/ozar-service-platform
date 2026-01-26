import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    server: Server;
    private userSockets;
    private typingUsers;
    constructor(jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): void;
    handleLeaveConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): void;
    handleTypingStart(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): void;
    handleTypingStop(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): void;
    handleMarkRead(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<void>;
    emitNewMessage(conversationId: string, message: any): void;
    emitConversationUpdate(conversationId: string): void;
    private broadcastUserStatus;
    isUserOnline(userId: string): boolean;
    getOnlineUsers(): string[];
}
export {};
