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
exports.NotificationsService = exports.NotificationType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_REQUEST"] = "BOOKING_REQUEST";
    NotificationType["BOOKING_ACCEPTED"] = "BOOKING_ACCEPTED";
    NotificationType["BOOKING_DECLINED"] = "BOOKING_DECLINED";
    NotificationType["BOOKING_COMPLETED"] = "BOOKING_COMPLETED";
    NotificationType["BOOKING_CANCELLED"] = "BOOKING_CANCELLED";
    NotificationType["MESSAGE_RECEIVED"] = "MESSAGE_RECEIVED";
    NotificationType["REVIEW_RECEIVED"] = "REVIEW_RECEIVED";
    NotificationType["DISPUTE_CREATED"] = "DISPUTE_CREATED";
    NotificationType["DISPUTE_RESOLVED"] = "DISPUTE_RESOLVED";
    NotificationType["VERIFICATION_APPROVED"] = "VERIFICATION_APPROVED";
    NotificationType["VERIFICATION_REJECTED"] = "VERIFICATION_REJECTED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, type, title, message, data) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data: data || {},
            },
        });
    }
    async getUserNotifications(userId, unreadOnly = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly ? { read: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: { read: true },
        });
    }
    async notifyBookingRequest(proUserId, bookingId, customerName) {
        return this.create(proUserId, NotificationType.BOOKING_REQUEST, 'New Booking Request', `${customerName} has requested a booking`, { bookingId });
    }
    async notifyBookingAccepted(customerId, bookingId, proName) {
        return this.create(customerId, NotificationType.BOOKING_ACCEPTED, 'Booking Accepted', `${proName} has accepted your booking`, { bookingId });
    }
    async notifyBookingDeclined(customerId, bookingId, proName) {
        return this.create(customerId, NotificationType.BOOKING_DECLINED, 'Booking Declined', `${proName} has declined your booking`, { bookingId });
    }
    async notifyBookingCompleted(customerId, bookingId, proName) {
        return this.create(customerId, NotificationType.BOOKING_COMPLETED, 'Booking Completed', `Your booking with ${proName} is complete. Please leave a review!`, { bookingId });
    }
    async notifyNewMessage(recipientId, senderName, conversationId) {
        return this.create(recipientId, NotificationType.MESSAGE_RECEIVED, 'New Message', `${senderName} sent you a message`, { conversationId });
    }
    async notifyVerificationStatus(proUserId, status) {
        const type = status === 'APPROVED'
            ? NotificationType.VERIFICATION_APPROVED
            : NotificationType.VERIFICATION_REJECTED;
        const title = status === 'APPROVED'
            ? 'Profile Approved!'
            : 'Profile Verification Update';
        const message = status === 'APPROVED'
            ? 'Your professional profile has been approved. You can now receive bookings!'
            : 'Your profile verification needs attention. Please contact support.';
        return this.create(proUserId, type, title, message);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map