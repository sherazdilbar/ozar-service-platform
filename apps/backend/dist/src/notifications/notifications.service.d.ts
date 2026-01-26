import { PrismaService } from '../prisma/prisma.service';
export declare enum NotificationType {
    BOOKING_REQUEST = "BOOKING_REQUEST",
    BOOKING_ACCEPTED = "BOOKING_ACCEPTED",
    BOOKING_DECLINED = "BOOKING_DECLINED",
    BOOKING_COMPLETED = "BOOKING_COMPLETED",
    BOOKING_CANCELLED = "BOOKING_CANCELLED",
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
    REVIEW_RECEIVED = "REVIEW_RECEIVED",
    DISPUTE_CREATED = "DISPUTE_CREATED",
    DISPUTE_RESOLVED = "DISPUTE_RESOLVED",
    VERIFICATION_APPROVED = "VERIFICATION_APPROVED",
    VERIFICATION_REJECTED = "VERIFICATION_REJECTED"
}
export declare class NotificationsService {
    protected prisma: PrismaService;
    constructor(prisma: PrismaService);
    create(userId: string, type: NotificationType, title: string, message: string, data?: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    getUserNotifications(userId: string, unreadOnly?: boolean): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyBookingRequest(proUserId: string, bookingId: string, customerName: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingAccepted(customerId: string, bookingId: string, proName: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingDeclined(customerId: string, bookingId: string, proName: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingCompleted(customerId: string, bookingId: string, proName: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyNewMessage(recipientId: string, senderName: string, conversationId: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyVerificationStatus(proUserId: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
}
