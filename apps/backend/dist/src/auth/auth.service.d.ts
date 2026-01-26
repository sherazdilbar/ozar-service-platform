import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto';
import { NotificationsEnhancedService } from '../notifications/notifications-enhanced.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private notificationsService;
    private emailService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, notificationsService: NotificationsEnhancedService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            role: import(".prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            location: {
                city: string;
                area: string;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            role: import(".prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            location: {
                city: string;
                area: string;
                lat: number;
                lng: number;
            };
        };
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<void>;
    private generateTokens;
    private saveRefreshToken;
    private sendVerificationEmail;
    private sendPasswordResetEmail;
}
