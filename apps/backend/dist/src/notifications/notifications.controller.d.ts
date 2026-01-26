import { NotificationsEnhancedService } from './notifications-enhanced.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsEnhancedService);
    getUserNotifications(req: any, unreadOnly?: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        read: boolean;
    }[]>;
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
