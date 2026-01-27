import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private favoritesService;
    constructor(favoritesService: FavoritesService);
    getFavorites(req: any): Promise<({
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
    })[]>;
    addFavorite(proId: string, req: any): Promise<{
        message: string;
        favorite: {
            id: string;
            createdAt: Date;
            proId: string;
            customerId: string;
        };
    }>;
    removeFavorite(proId: string, req: any): Promise<{
        message: string;
    }>;
    isFavorite(proId: string, req: any): Promise<{
        isFavorite: boolean;
    }>;
}
