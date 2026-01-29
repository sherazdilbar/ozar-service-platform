import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        bio: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        preferredLanguage: string;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        locationCity: string | null;
        locationArea: string | null;
        locationLat: number | null;
        locationLng: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        bio: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        bio?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        bio: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
