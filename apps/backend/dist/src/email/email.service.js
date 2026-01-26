"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const templates_1 = require("./templates");
const translations_1 = require("./translations");
let EmailService = class EmailService {
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
    async sendEmail(options) {
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });
            console.log('✅ Email sent to:', options.to);
        }
        catch (error) {
            console.error('❌ Error sending email:', error);
            throw error;
        }
    }
    async sendBookingConfirmation(to, bookingData) {
        const html = templates_1.emailTemplates.bookingConfirmation(bookingData);
        const subject = `${translations_1.emailTranslations.hu.bookingConfirmation.subject} / ${translations_1.emailTranslations.en.bookingConfirmation.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Booking confirmation email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending booking confirmation email:', error);
            throw error;
        }
    }
    async sendBookingAccepted(to, bookingData) {
        const html = templates_1.emailTemplates.bookingAccepted(bookingData);
        const subject = `${translations_1.emailTranslations.hu.bookingAccepted.subject} / ${translations_1.emailTranslations.en.bookingAccepted.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Booking accepted email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending booking accepted email:', error);
            throw error;
        }
    }
    async sendBookingCancelled(to, bookingData) {
        const html = templates_1.emailTemplates.bookingCancelled(bookingData);
        const subject = `${translations_1.emailTranslations.hu.bookingCancelled.subject} / ${translations_1.emailTranslations.en.bookingCancelled.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Booking cancelled email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending booking cancelled email:', error);
            throw error;
        }
    }
    async sendBookingCompleted(to, bookingData) {
        const html = templates_1.emailTemplates.bookingCompleted(bookingData);
        const subject = `${translations_1.emailTranslations.hu.bookingCompleted.subject} / ${translations_1.emailTranslations.en.bookingCompleted.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Booking completed email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending booking completed email:', error);
            throw error;
        }
    }
    async sendWelcomeEmail(to, userData) {
        const html = templates_1.emailTemplates.welcome(userData);
        const subject = `${translations_1.emailTranslations.hu.welcome.subject} / ${translations_1.emailTranslations.en.welcome.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Welcome email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending welcome email:', error);
            throw error;
        }
    }
    async sendPasswordReset(to, resetData) {
        const html = templates_1.emailTemplates.passwordReset(resetData);
        const subject = `${translations_1.emailTranslations.hu.passwordReset.subject} / ${translations_1.emailTranslations.en.passwordReset.subject}`;
        try {
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Ozar'}" <${process.env.EMAIL_FROM || 'noreply@ozar.com'}>`,
                to,
                subject,
                html,
            });
            console.log('✅ Password reset email sent to:', to);
        }
        catch (error) {
            console.error('❌ Error sending password reset email:', error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map