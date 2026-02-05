import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        pros: {
            total: number;
            pending: number;
            approved: number;
        };
        bookings: {
            total: number;
            active: number;
        };
        disputes: {
            total: number;
            open: number;
        };
        revenue: {
            total: number;
        };
    }>;
    getPros(filters?: {
        status?: string;
        city?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
                createdAt: Date;
            };
            services: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                description: string;
                category: import(".prisma/client").$Enums.ServiceCategory;
                pricingModel: import(".prisma/client").$Enums.PricingModel;
                price: number;
                duration: number;
                isActive: boolean;
                proId: string;
            }[];
        } & {
            id: string;
            bio: string | null;
            locationCity: string;
            locationDistrict: string | null;
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
            serviceAreaDistricts: string[];
            serviceAreaRadius: number;
            onboardingCompleted: boolean;
            onboardingStep: string | null;
            onboardingDraft: import(".prisma/client/runtime/library").JsonValue | null;
            onboardingStartedAt: Date | null;
            onboardingCompletedAt: Date | null;
            userId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    verifyPro(proId: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<{
        user: {
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
            locationDistrict: string | null;
            locationArea: string | null;
            locationLat: number | null;
            locationLng: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        bio: string | null;
        locationCity: string;
        locationDistrict: string | null;
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
        serviceAreaDistricts: string[];
        serviceAreaRadius: number;
        onboardingCompleted: boolean;
        onboardingStep: string | null;
        onboardingDraft: import(".prisma/client/runtime/library").JsonValue | null;
        onboardingStartedAt: Date | null;
        onboardingCompletedAt: Date | null;
        userId: string;
    }>;
    getAllBookings(filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            pro: {
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                bio: string | null;
                locationCity: string;
                locationDistrict: string | null;
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
                serviceAreaDistricts: string[];
                serviceAreaRadius: number;
                onboardingCompleted: boolean;
                onboardingStep: string | null;
                onboardingDraft: import(".prisma/client/runtime/library").JsonValue | null;
                onboardingStartedAt: Date | null;
                onboardingCompletedAt: Date | null;
                userId: string;
            };
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                description: string;
                category: import(".prisma/client").$Enums.ServiceCategory;
                pricingModel: import(".prisma/client").$Enums.PricingModel;
                price: number;
                duration: number;
                isActive: boolean;
                proId: string;
            };
            customer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
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
            images: string[];
            status: import(".prisma/client").$Enums.BookingStatus;
            customerId: string;
            serviceId: string;
            scheduledFor: Date | null;
            isASAP: boolean;
            completedAt: Date | null;
            cancellationReason: string | null;
            customerNotes: string | null;
            locationAddr: string;
            servicePrice: number;
            platformFee: number;
            total: number;
            cancelledBy: string | null;
            cancellationFee: number | null;
            refundAmount: number | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDisputes(filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            booking: {
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
                    locationDistrict: string | null;
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
                    serviceAreaDistricts: string[];
                    serviceAreaRadius: number;
                    onboardingCompleted: boolean;
                    onboardingStep: string | null;
                    onboardingDraft: import(".prisma/client/runtime/library").JsonValue | null;
                    onboardingStartedAt: Date | null;
                    onboardingCompletedAt: Date | null;
                    userId: string;
                };
                customer: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
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
                images: string[];
                status: import(".prisma/client").$Enums.BookingStatus;
                customerId: string;
                serviceId: string;
                scheduledFor: Date | null;
                isASAP: boolean;
                completedAt: Date | null;
                cancellationReason: string | null;
                customerNotes: string | null;
                locationAddr: string;
                servicePrice: number;
                platformFee: number;
                total: number;
                cancelledBy: string | null;
                cancellationFee: number | null;
                refundAmount: number | null;
            };
            raisedByUser: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            resolver: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            bookingId: string;
            reason: string;
            status: import(".prisma/client").$Enums.DisputeStatus;
            raisedBy: string;
            resolution: string | null;
            resolvedBy: string | null;
            resolvedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    resolveDispute(disputeId: string, adminId: string, resolution: string, refundAmount?: number): Promise<{
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
            status: import(".prisma/client").$Enums.BookingStatus;
            customerId: string;
            serviceId: string;
            scheduledFor: Date | null;
            isASAP: boolean;
            completedAt: Date | null;
            cancellationReason: string | null;
            customerNotes: string | null;
            locationAddr: string;
            servicePrice: number;
            platformFee: number;
            total: number;
            cancelledBy: string | null;
            cancellationFee: number | null;
            refundAmount: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        bookingId: string;
        reason: string;
        status: import(".prisma/client").$Enums.DisputeStatus;
        raisedBy: string;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
    }>;
}
