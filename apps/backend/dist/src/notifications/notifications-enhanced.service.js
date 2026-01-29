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
exports.NotificationsEnhancedService = exports.NotificationType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("./notifications.service");
Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function () { return notifications_service_1.NotificationType; } });
let NotificationsEnhancedService = class NotificationsEnhancedService extends notifications_service_1.NotificationsService {
    constructor(prisma, emailService) {
        super(prisma);
        this.emailService = emailService;
    }
    async notifyBookingRequest(proUserId, bookingId, customerName, bookingData) {
        const notification = await super.notifyBookingRequest(proUserId, bookingId, customerName);
        if (bookingData) {
            const user = await this.prisma.user.findUnique({
                where: { id: proUserId },
                select: { email: true },
            });
            if (user?.email) {
                await this.emailService.sendBookingConfirmation(user.email, {
                    customerName,
                    ...bookingData,
                });
            }
        }
        return notification;
    }
    async notifyBookingAccepted(customerId, bookingId, proName, bookingData) {
        const notification = await super.notifyBookingAccepted(customerId, bookingId, proName);
        if (bookingData) {
            const user = await this.prisma.user.findUnique({
                where: { id: customerId },
                select: { email: true, firstName: true },
            });
            if (user?.email) {
                await this.emailService.sendBookingAccepted(user.email, {
                    customerName: user.firstName,
                    proName,
                    ...bookingData,
                });
            }
        }
        return notification;
    }
    async notifyBookingCancelled(userId, bookingId, proName, bookingData) {
        await this.create(userId, notifications_service_1.NotificationType.BOOKING_CANCELLED, 'Booking Cancelled', `${proName} has cancelled your booking`, { bookingId });
        if (bookingData) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, firstName: true },
            });
            if (user?.email) {
                await this.emailService.sendBookingCancelled(user.email, {
                    customerName: user.firstName,
                    proName,
                    ...bookingData,
                });
            }
        }
    }
    async notifyBookingCompleted(customerId, bookingId, proName, bookingData) {
        const notification = await super.notifyBookingCompleted(customerId, bookingId, proName);
        if (bookingData) {
            const user = await this.prisma.user.findUnique({
                where: { id: customerId },
                select: { email: true, firstName: true },
            });
            if (user?.email) {
                await this.emailService.sendBookingCompleted(user.email, {
                    customerName: user.firstName,
                    proName,
                    ...bookingData,
                });
            }
        }
        return notification;
    }
    async notifyBookingConfirmation(customerId, bookingId, bookingData) {
        await this.create(customerId, notifications_service_1.NotificationType.BOOKING_REQUEST, 'Booking Confirmed', 'Your booking request has been sent', { bookingId });
        const user = await this.prisma.user.findUnique({
            where: { id: customerId },
            select: { email: true, firstName: true },
        });
        if (user?.email) {
            await this.emailService.sendBookingConfirmation(user.email, {
                customerName: user.firstName,
                ...bookingData,
            });
        }
    }
    async sendWelcomeEmail(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                firstName: true,
                role: true,
            },
        });
        if (user?.email) {
            await this.emailService.sendWelcomeEmail(user.email, {
                name: user.firstName,
                role: user.role,
            });
        }
    }
    async sendPasswordResetEmail(userId, resetToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                firstName: true,
            },
        });
        if (user?.email) {
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
            await this.emailService.sendPasswordReset(user.email, {
                name: user.firstName,
                resetLink,
            });
        }
    }
};
exports.NotificationsEnhancedService = NotificationsEnhancedService;
exports.NotificationsEnhancedService = NotificationsEnhancedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NotificationsEnhancedService);
//# sourceMappingURL=notifications-enhanced.service.js.map