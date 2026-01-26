import { ProsService } from './pros.service';
import { GetProsDto, CreateProDto, UpdateProDto, UpdateOnboardingStepDto } from './dto';
import { ServiceCategory } from '@prisma/client';
export declare class ProsController {
    private prosService;
    constructor(prosService: ProsService);
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
    create(req: any, dto: CreateProDto): Promise<{
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
    update(id: string, req: any, dto: UpdateProDto): Promise<{
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
    getReviews(id: string, page?: number, limit?: number): Promise<{
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
    getMyProfile(req: any): Promise<{
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
    updateMyProfile(req: any, dto: UpdateProDto): Promise<{
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
    addPortfolioItem(id: string, req: any, data: {
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
    getPortfolio(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        proId: string;
        title: string;
        imageUrl: string;
    }[]>;
    deletePortfolioItem(itemId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        proId: string;
        title: string;
        imageUrl: string;
    }>;
    getOnboardingStatus(req: any): Promise<{
        completed: boolean;
        currentStep: string;
        startedAt: Date;
        completedAt: Date;
    }>;
    updateOnboardingStep(req: any, dto: UpdateOnboardingStepDto): Promise<{
        success: boolean;
        currentStep: string;
    }>;
    completeOnboarding(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
