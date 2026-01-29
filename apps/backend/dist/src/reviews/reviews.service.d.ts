import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProReviews(proId: string, page?: number, limit?: number): Promise<{
        data: ({
            customer: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            helpfulVotes: {
                userId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            proId: string;
            bookingId: string;
            customerId: string;
            comment: string;
            images: string[];
            responseText: string | null;
            responseAt: Date | null;
            helpfulCount: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyReviews(userId: string): Promise<{
        data: ({
            booking: {
                service: {
                    name: string;
                };
            } & {
                id: string;
                locationCity: string;
                locationLat: number;
                locationLng: number;
                createdAt: Date;
                updatedAt: Date;
                currency: string;
                description: string;
                proId: string;
                status: import(".prisma/client").$Enums.BookingStatus;
                customerId: string;
                images: string[];
                serviceId: string;
                scheduledFor: Date | null;
                isASAP: boolean;
                customerNotes: string | null;
                locationAddr: string;
                servicePrice: number;
                platformFee: number;
                total: number;
                completedAt: Date | null;
                cancellationReason: string | null;
                cancelledBy: string | null;
                cancellationFee: number | null;
                refundAmount: number | null;
            };
            customer: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            proId: string;
            bookingId: string;
            customerId: string;
            comment: string;
            images: string[];
            responseText: string | null;
            responseAt: Date | null;
            helpfulCount: number;
        })[];
    }>;
    respondToReview(reviewId: string, userId: string, responseText: string): Promise<{
        customer: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        proId: string;
        bookingId: string;
        customerId: string;
        comment: string;
        images: string[];
        responseText: string | null;
        responseAt: Date | null;
        helpfulCount: number;
    }>;
    flagReview(reviewId: string, userId: string, reason: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleHelpfulVote(reviewId: string, userId: string): Promise<{
        helpful: boolean;
    }>;
    isReviewHelpful(reviewId: string, userId: string): Promise<{
        helpful: boolean;
    }>;
    getReviewById(reviewId: string): Promise<{
        pro: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            bio: string | null;
            locationCity: string;
            locationArea: string;
            locationLat: number;
            locationLng: number;
            createdAt: Date;
            updatedAt: Date;
            businessName: string | null;
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
        customer: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        helpfulVotes: {
            userId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        proId: string;
        bookingId: string;
        customerId: string;
        comment: string;
        images: string[];
        responseText: string | null;
        responseAt: Date | null;
        helpfulCount: number;
    }>;
}
