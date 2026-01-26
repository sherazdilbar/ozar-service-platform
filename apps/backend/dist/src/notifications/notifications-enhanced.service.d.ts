import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from './notifications.service';
export declare class NotificationsEnhancedService extends NotificationsService {
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    notifyBookingRequest(proUserId: string, bookingId: string, customerName: string, bookingData?: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingAccepted(customerId: string, bookingId: string, proName: string, bookingData?: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingCancelled(userId: string, bookingId: string, proName: string, bookingData?: any): Promise<void>;
    notifyBookingCompleted(customerId: string, bookingId: string, proName: string, bookingData?: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }>;
    notifyBookingConfirmation(customerId: string, bookingId: string, bookingData: any): Promise<void>;
    sendWelcomeEmail(userId: string): Promise<void>;
    sendPasswordResetEmail(userId: string, resetToken: string): Promise<void>;
}
