import { UsersService } from './users.service';
import { UploadService } from '../upload/upload.service';
export declare class UsersController {
    private readonly usersService;
    private readonly uploadService;
    constructor(usersService: UsersService, uploadService: UploadService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, data: {
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
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            bio: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        avatarUrl: string;
    }>;
}
