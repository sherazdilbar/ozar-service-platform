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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_enhanced_service_1 = require("../notifications/notifications-enhanced.service");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config, notificationsService, emailService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date();
        emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                role: dto.role,
                locationCity: dto.location?.city,
                locationArea: dto.location?.area,
                locationLat: dto.location?.lat,
                locationLng: dto.location?.lng,
                emailVerificationToken,
                emailVerificationExpires,
            },
        });
        if (dto.role === 'PRO') {
            await this.prisma.proProfile.create({
                data: {
                    userId: user.id,
                    businessName: `${dto.firstName} ${dto.lastName}`,
                    bio: '',
                    categories: [],
                    verificationStatus: 'PENDING',
                    availabilityStatus: 'OFFLINE',
                    currency: 'HUF',
                    startingPrice: 0,
                    responseTime: 30,
                    serviceAreaCity: dto.location?.city || '',
                    serviceAreaRadius: 10,
                    locationCity: dto.location?.city || '',
                    locationArea: dto.location?.area || '',
                    locationLat: dto.location?.lat || 0,
                    locationLng: dto.location?.lng || 0,
                },
            });
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        this.sendVerificationEmail(user.email, emailVerificationToken, user.firstName).catch(err => {
            console.error('Failed to send verification email:', err);
        });
        this.notificationsService.sendWelcomeEmail(user.id).catch(err => {
            console.error('Failed to send welcome email:', err);
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                emailVerified: user.emailVerified,
                location: dto.location ? {
                    city: dto.location.city,
                    area: dto.location.area,
                } : null,
            },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                emailVerified: user.emailVerified,
                location: user.locationCity ? {
                    city: user.locationCity,
                    area: user.locationArea,
                    lat: user.locationLat,
                    lng: user.locationLng,
                } : null,
            },
            ...tokens,
        };
    }
    async verifyEmail(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                emailVerificationToken: dto.token,
                emailVerificationExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
            },
        });
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date();
        emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken,
                emailVerificationExpires,
            },
        });
        await this.sendVerificationEmail(user.email, emailVerificationToken, user.firstName);
        return { message: 'Verification email sent' };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date();
        passwordResetExpires.setHours(passwordResetExpires.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });
        await this.sendPasswordResetEmail(user.email, resetToken, user.firstName);
        return { message: 'If the email exists, a password reset link has been sent' };
    }
    async resetPassword(dto) {
        const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        await this.prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });
        return { message: 'Password reset successfully' };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const tokenRecord = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.generateTokens(payload.userId, payload.email, payload.role);
            await this.prisma.refreshToken.delete({
                where: { token: refreshToken },
            });
            await this.saveRefreshToken(payload.userId, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
                token: refreshToken,
            },
        });
    }
    async generateTokens(userId, email, role) {
        const payload = { userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    }
    async sendVerificationEmail(email, token, firstName) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
        await this.emailService.sendEmail({
            to: email,
            subject: 'Verify your email - Ozar',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${firstName},</h2>
          <p>Thank you for registering with Ozar! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #00BCD4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Ozar - Find Local Professionals</p>
        </div>
      `,
        });
    }
    async sendPasswordResetEmail(email, token, firstName) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
        await this.emailService.sendEmail({
            to: email,
            subject: 'Reset your password - Ozar',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${firstName},</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Ozar - Find Local Professionals</p>
        </div>
      `,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        notifications_enhanced_service_1.NotificationsEnhancedService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map