export declare class GetProsDto {
    city?: string;
    categoryId?: string;
    availableNow?: boolean;
    radiusKm?: number;
    lat?: number;
    lng?: number;
    query?: string;
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}
declare class ServiceAreaDto {
    city: string;
    radiusKm: number;
}
declare class LocationDto {
    city: string;
    area: string;
    lat: number;
    lng: number;
}
export declare class CreateProDto {
    businessName: string;
    bio: string;
    categories: string[];
    serviceArea: ServiceAreaDto;
    location: LocationDto;
}
export declare class UpdateProDto {
    businessName?: string;
    bio?: string;
    categories?: string[];
    availabilityStatus?: string;
    yearsExperience?: number;
    serviceAreaCity?: string;
    serviceAreaRadius?: number;
    locationCity?: string;
    locationArea?: string;
    locationLat?: number;
    locationLng?: number;
    phone?: string;
    serviceArea?: ServiceAreaDto;
    location?: LocationDto;
}
export declare class UpdateOnboardingStepDto {
    step: string;
}
export declare class CompleteOnboardingDto {
    completed?: boolean;
}
export {};
