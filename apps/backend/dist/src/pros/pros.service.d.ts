import { PrismaService } from '../prisma/prisma.service';
import { GetProsDto, CreateProDto, UpdateProDto } from './dto';
import { ServiceCategory } from '@prisma/client';
export declare class ProsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(dto: GetProsDto): Promise<{
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        location: {
            city: string;
            area: string;
            lat: number;
            lng: number;
        };
        serviceArea: {
            city: string;
            radiusKm: number;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            role: import(".prisma/client").$Enums.UserRole;
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
            proId: string;
        }[];
        portfolio: {
            id: string;
            createdAt: Date;
            description: string;
            category: import(".prisma/client").$Enums.ServiceCategory;
            proId: string;
            title: string;
            imageUrl: string;
        }[];
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
    }>;
    create(userId: string, dto: CreateProDto): Promise<{
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
            proId: string;
        }[];
        portfolio: {
            id: string;
            createdAt: Date;
            description: string;
            category: import(".prisma/client").$Enums.ServiceCategory;
            proId: string;
            title: string;
            imageUrl: string;
        }[];
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
    }>;
    update(id: string, userId: string, dto: UpdateProDto): Promise<{
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
            proId: string;
        }[];
        portfolio: {
            id: string;
            createdAt: Date;
            description: string;
            category: import(".prisma/client").$Enums.ServiceCategory;
            proId: string;
            title: string;
            imageUrl: string;
        }[];
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
    }>;
    getReviews(proId: string, page?: number, limit?: number): Promise<{
        data: ({
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
            responseText: string | null;
            responseAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private calculateDistance;
    private toRad;
    getMyProfile(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            role: import(".prisma/client").$Enums.UserRole;
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
            proId: string;
        }[];
        portfolio: {
            id: string;
            createdAt: Date;
            description: string;
            category: import(".prisma/client").$Enums.ServiceCategory;
            proId: string;
            title: string;
            imageUrl: string;
        }[];
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
    }>;
    updateMyProfile(userId: string, dto: UpdateProDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            role: import(".prisma/client").$Enums.UserRole;
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
            proId: string;
        }[];
        portfolio: {
            id: string;
            createdAt: Date;
            description: string;
            category: import(".prisma/client").$Enums.ServiceCategory;
            proId: string;
            title: string;
            imageUrl: string;
        }[];
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
    }>;
    addPortfolioItem(proId: string, userId: string, data: {
        imageUrl: string;
        title: string;
        description: string;
        category: ServiceCategory;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        proId: string;
        title: string;
        imageUrl: string;
    }>;
    getPortfolio(proId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        proId: string;
        title: string;
        imageUrl: string;
    }[]>;
    deletePortfolioItem(itemId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        proId: string;
        title: string;
        imageUrl: string;
    }>;
    getOnboardingStatus(userId: string): Promise<{
        completed: boolean;
        currentStep: string;
        startedAt: Date;
        completedAt: Date;
    }>;
    updateOnboardingStep(userId: string, step: string): Promise<{
        success: boolean;
        currentStep: string;
    }>;
    completeOnboarding(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
