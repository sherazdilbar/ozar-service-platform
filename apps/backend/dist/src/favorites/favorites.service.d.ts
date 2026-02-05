import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private prisma;
    constructor(prisma: PrismaService);
    addFavorite(customerId: string, proId: string): Promise<{
        message: string;
        favorite: {
            id: string;
            createdAt: Date;
            proId: string;
            customerId: string;
        };
    }>;
    removeFavorite(customerId: string, proId: string): Promise<{
        message: string;
    }>;
    getFavorites(customerId: string): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
        };
        services: {
            id: string;
            name: string;
            currency: string;
            price: number;
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
    })[]>;
    isFavorite(customerId: string, proId: string): Promise<{
        isFavorite: boolean;
    }>;
}
