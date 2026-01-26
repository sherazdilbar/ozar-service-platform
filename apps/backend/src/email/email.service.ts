import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailTemplates } from './templates';
import { emailTranslations } from './translations';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Generic send email method
   */
  async sendEmail(options: { to: string; subject: string; html: string; text?: string }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log('✅ Email sent to:', options.to);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send booking confirmation email (bilingual)
   */
  async sendBookingConfirmation(to: string, bookingData: any): Promise<void> {
    const html = emailTemplates.bookingConfirmation(bookingData);
    const subject = `${emailTranslations.hu.bookingConfirmation.subject} / ${emailTranslations.en.bookingConfirmation.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Booking confirmation email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending booking confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send booking accepted email (bilingual)
   */
  async sendBookingAccepted(to: string, bookingData: any): Promise<void> {
    const html = emailTemplates.bookingAccepted(bookingData);
    const subject = `${emailTranslations.hu.bookingAccepted.subject} / ${emailTranslations.en.bookingAccepted.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Booking accepted email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending booking accepted email:', error);
      throw error;
    }
  }

  /**
   * Send booking cancelled email (bilingual)
   */
  async sendBookingCancelled(to: string, bookingData: any): Promise<void> {
    const html = emailTemplates.bookingCancelled(bookingData);
    const subject = `${emailTranslations.hu.bookingCancelled.subject} / ${emailTranslations.en.bookingCancelled.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Booking cancelled email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending booking cancelled email:', error);
      throw error;
    }
  }

  /**
   * Send booking completed email (bilingual)
   */
  async sendBookingCompleted(to: string, bookingData: any): Promise<void> {
    const html = emailTemplates.bookingCompleted(bookingData);
    const subject = `${emailTranslations.hu.bookingCompleted.subject} / ${emailTranslations.en.bookingCompleted.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Booking completed email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending booking completed email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email (bilingual)
   */
  async sendWelcomeEmail(to: string, userData: any): Promise<void> {
    const html = emailTemplates.welcome(userData);
    const subject = `${emailTranslations.hu.welcome.subject} / ${emailTranslations.en.welcome.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Welcome email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email (bilingual)
   */
  async sendPasswordReset(to: string, resetData: any): Promise<void> {
    const html = emailTemplates.passwordReset(resetData);
    const subject = `${emailTranslations.hu.passwordReset.subject} / ${emailTranslations.en.passwordReset.subject}`;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
        to,
        subject,
        html,
      });
      console.log('✅ Password reset email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      throw error;
    }
  }
}
