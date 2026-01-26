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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.userSockets = new Map();
        this.typingUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.userId = payload.sub;
            const userSocketIds = this.userSockets.get(client.userId) || [];
            userSocketIds.push(client.id);
            this.userSockets.set(client.userId, userSocketIds);
            this.broadcastUserStatus(client.userId, 'online');
            console.log(`User ${client.userId} connected with socket ${client.id}`);
        }
        catch (error) {
            console.error('WebSocket authentication failed:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (!client.userId)
            return;
        const userSocketIds = this.userSockets.get(client.userId) || [];
        const updatedSocketIds = userSocketIds.filter(id => id !== client.id);
        if (updatedSocketIds.length === 0) {
            this.userSockets.delete(client.userId);
            this.broadcastUserStatus(client.userId, 'offline');
        }
        else {
            this.userSockets.set(client.userId, updatedSocketIds);
        }
        console.log(`User ${client.userId} disconnected socket ${client.id}`);
    }
    handleJoinConversation(client, data) {
        client.join(`conversation:${data.conversationId}`);
        console.log(`User ${client.userId} joined conversation ${data.conversationId}`);
    }
    handleLeaveConversation(client, data) {
        client.leave(`conversation:${data.conversationId}`);
        console.log(`User ${client.userId} left conversation ${data.conversationId}`);
    }
    handleTypingStart(client, data) {
        if (!client.userId)
            return;
        const typingSet = this.typingUsers.get(data.conversationId) || new Set();
        typingSet.add(client.userId);
        this.typingUsers.set(data.conversationId, typingSet);
        client.to(`conversation:${data.conversationId}`).emit('user_typing', {
            conversationId: data.conversationId,
            userId: client.userId,
            isTyping: true,
        });
    }
    handleTypingStop(client, data) {
        if (!client.userId)
            return;
        const typingSet = this.typingUsers.get(data.conversationId);
        if (typingSet) {
            typingSet.delete(client.userId);
            if (typingSet.size === 0) {
                this.typingUsers.delete(data.conversationId);
            }
        }
        client.to(`conversation:${data.conversationId}`).emit('user_typing', {
            conversationId: data.conversationId,
            userId: client.userId,
            isTyping: false,
        });
    }
    async handleMarkRead(client, data) {
        if (!client.userId)
            return;
        await this.prisma.message.updateMany({
            where: {
                conversationId: data.conversationId,
                senderId: { not: client.userId },
                read: false,
            },
            data: { read: true },
        });
        this.server.to(`conversation:${data.conversationId}`).emit('messages_read', {
            conversationId: data.conversationId,
            readBy: client.userId,
        });
    }
    emitNewMessage(conversationId, message) {
        this.server.to(`conversation:${conversationId}`).emit('new_message', {
            conversationId,
            message,
        });
        this.emitConversationUpdate(conversationId);
    }
    emitConversationUpdate(conversationId) {
        this.server.emit('conversation_updated', {
            conversationId,
        });
    }
    broadcastUserStatus(userId, status) {
        this.server.emit('user_status', {
            userId,
            status,
            timestamp: new Date().toISOString(),
        });
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
    getOnlineUsers() {
        return Array.from(this.userSockets.keys());
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3001',
            credentials: true,
        },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map