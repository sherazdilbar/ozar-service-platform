import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService, NotificationType } from './notifications.service';

@Injectable()
export class NotificationsEnhancedService extends NotificationsService {
  constructor(
    prisma: PrismaService,
    private emailService: EmailService,
  ) {
    super(prisma);
  }

  /**
   * Send booking request notification with email
   */
  async notifyBookingRequest(
    proUserId: string,
    bookingId: string,
    customerName: string,
    bookingData?: any,
  ) {
    // Create in-app notification
    const notification = await super.notifyBookingRequest(proUserId, bookingId, customerName);

    // Send email
    if (bookingData) {
      const user = await this.prisma.user.findUnique({
        where: { id: proUserId },
        select: { email: true },
      });

      if (user?.email) {
        await this.emailService.sendBookingConfirmation(
          user.email,
          {
            customerName,
            ...bookingData,
          },
        );
      }
    }
    
    return notification;
  }

  /**
   * Send booking accepted notification with email
   */
  async notifyBookingAccepted(
    customerId: string,
    bookingId: string,
    proName: string,
    bookingData?: any,
  ) {
    // Create in-app notification
    const notification = await super.notifyBookingAccepted(customerId, bookingId, proName);

    // Send email
    if (bookingData) {
      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        select: { email: true, firstName: true },
      });

      if (user?.email) {
        await this.emailService.sendBookingAccepted(
          user.email,
          {
            customerName: user.firstName,
            proName,
            ...bookingData,
          },
        );
      }
    }
    
    return notification;
  }

  /**
   * Send booking cancelled notification with email
   */
  async notifyBookingCancelled(
    userId: string,
    bookingId: string,
    proName: string,
    bookingData?: any,
  ) {
    // Create in-app notification
    await this.create(
      userId,
      NotificationType.BOOKING_CANCELLED,
      'Booking Cancelled',
      `${proName} has cancelled your booking`,
      { bookingId },
    );

    // Send email
    if (bookingData) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true },
      });

      if (user?.email) {
        await this.emailService.sendBookingCancelled(
          user.email,
          {
            customerName: user.firstName,
            proName,
            ...bookingData,
          },
        );
      }
    }
  }

  /**
   * Send booking completed notification with email
   */
  async notifyBookingCompleted(
    customerId: string,
    bookingId: string,
    proName: string,
    bookingData?: any,
  ) {
    // Create in-app notification
    const notification = await super.notifyBookingCompleted(customerId, bookingId, proName);

    // Send email
    if (bookingData) {
      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        select: { email: true, firstName: true },
      });

      if (user?.email) {
        await this.emailService.sendBookingCompleted(
          user.email,
          {
            customerName: user.firstName,
            proName,
            ...bookingData,
          },
        );
      }
    }
    
    return notification;
  }

  /**
   * Send booking confirmation notification with email
   */
  async notifyBookingConfirmation(
    customerId: string,
    bookingId: string,
    bookingData: any,
  ) {
    // Create in-app notification
    await this.create(
      customerId,
      NotificationType.BOOKING_REQUEST,
      'Booking Confirmed',
      'Your booking request has been sent',
      { bookingId },
    );

    // Send email
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
      select: { email: true, firstName: true },
    });

    if (user?.email) {
      await this.emailService.sendBookingConfirmation(
        user.email,
        {
          customerName: user.firstName,
          ...bookingData,
        },
      );
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        role: true,
      },
    });

    if (user?.email) {
      await this.emailService.sendWelcomeEmail(
        user.email,
        {
          name: user.firstName,
          role: user.role,
        },
      );
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userId: string, resetToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
      },
    });

    if (user?.email) {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      await this.emailService.sendPasswordReset(
        user.email,
        {
          name: user.firstName,
          resetLink,
        },
      );
    }
  }
}
