import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_ACCEPTED = 'BOOKING_ACCEPTED',
  BOOKING_DECLINED = 'BOOKING_DECLINED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  DISPUTE_CREATED = 'DISPUTE_CREATED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED = 'VERIFICATION_REJECTED',
}

@Injectable()
export class NotificationsService {
  constructor(protected prisma: PrismaService) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ) {
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

  async getUserNotifications(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  // Helper methods for common notifications
  async notifyBookingRequest(proUserId: string, bookingId: string, customerName: string) {
    return this.create(
      proUserId,
      NotificationType.BOOKING_REQUEST,
      'New Booking Request',
      `${customerName} has requested a booking`,
      { bookingId },
    );
  }

  async notifyBookingAccepted(customerId: string, bookingId: string, proName: string) {
    return this.create(
      customerId,
      NotificationType.BOOKING_ACCEPTED,
      'Booking Accepted',
      `${proName} has accepted your booking`,
      { bookingId },
    );
  }

  async notifyBookingDeclined(customerId: string, bookingId: string, proName: string) {
    return this.create(
      customerId,
      NotificationType.BOOKING_DECLINED,
      'Booking Declined',
      `${proName} has declined your booking`,
      { bookingId },
    );
  }

  async notifyBookingCompleted(customerId: string, bookingId: string, proName: string) {
    return this.create(
      customerId,
      NotificationType.BOOKING_COMPLETED,
      'Booking Completed',
      `Your booking with ${proName} is complete. Please leave a review!`,
      { bookingId },
    );
  }

  async notifyNewMessage(recipientId: string, senderName: string, conversationId: string) {
    return this.create(
      recipientId,
      NotificationType.MESSAGE_RECEIVED,
      'New Message',
      `${senderName} sent you a message`,
      { conversationId },
    );
  }

  async notifyVerificationStatus(proUserId: string, status: 'APPROVED' | 'REJECTED') {
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
}
