import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getConversations(req: any): Promise<{
        data: {
            unreadCount: number;
            lastMessage: {
                sender: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                text: string;
                read: boolean;
                imageUrl: string | null;
                conversationId: string;
                senderId: string;
            };
            pro: {
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                id: string;
                locationCity: string;
                locationArea: string;
                locationLat: number;
                locationLng: number;
                createdAt: Date;
                updatedAt: Date;
                businessName: string | null;
                bio: string | null;
                categories: import(".prisma/client").$Enums.ServiceCategory[];
                rating: number;
                reviewCount: number;
                jobsCompleted: number;
                yearsExperience: number;
                verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
                availabilityStatus: import(".prisma/client").$Enums.AvailabilityStatus;
                startingPrice: number;
                currency: string;
                responseTime: number;
                serviceAreaCity: string;
                serviceAreaRadius: number;
                onboardingCompleted: boolean;
                onboardingStep: string | null;
                onboardingStartedAt: Date | null;
                onboardingCompletedAt: Date | null;
                userId: string;
            };
            booking: {
                id: string;
                status: import(".prisma/client").$Enums.BookingStatus;
            };
            customer: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            messages: ({
                sender: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                text: string;
                read: boolean;
                imageUrl: string | null;
                conversationId: string;
                senderId: string;
            })[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            proId: string;
            bookingId: string | null;
            customerId: string;
        }[];
    }>;
    createConversation(req: any, dto: CreateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        proId: string;
        bookingId: string | null;
        customerId: string;
    }>;
    getConversation(id: string, req: any): Promise<{
        pro: {
            user: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                phone: string;
                avatar: string | null;
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
            };
        } & {
            id: string;
            locationCity: string;
            locationArea: string;
            locationLat: number;
            locationLng: number;
            createdAt: Date;
            updatedAt: Date;
            businessName: string | null;
            bio: string | null;
            categories: import(".prisma/client").$Enums.ServiceCategory[];
            rating: number;
            reviewCount: number;
            jobsCompleted: number;
            yearsExperience: number;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            availabilityStatus: import(".prisma/client").$Enums.AvailabilityStatus;
            startingPrice: number;
            currency: string;
            responseTime: number;
            serviceAreaCity: string;
            serviceAreaRadius: number;
            onboardingCompleted: boolean;
            onboardingStep: string | null;
            onboardingStartedAt: Date | null;
            onboardingCompletedAt: Date | null;
            userId: string;
        };
        booking: {
            id: string;
            locationCity: string;
            locationLat: number;
            locationLng: number;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            description: string;
            proId: string;
            images: string[];
            customerId: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            serviceId: string;
            scheduledFor: Date | null;
            isASAP: boolean;
            completedAt: Date | null;
            cancellationReason: string | null;
            locationAddr: string;
            servicePrice: number;
            platformFee: number;
            total: number;
            cancelledBy: string | null;
            cancellationFee: number | null;
            refundAmount: number | null;
        };
        customer: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string | null;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        proId: string;
        bookingId: string | null;
        customerId: string;
    }>;
    getMessages(id: string, req: any, page?: number, limit?: number): Promise<{
        data: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            text: string;
            read: boolean;
            imageUrl: string | null;
            conversationId: string;
            senderId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    sendMessage(id: string, req: any, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        text: string;
        read: boolean;
        imageUrl: string | null;
        conversationId: string;
        senderId: string;
    }>;
    markAsRead(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
