declare class LocationDto {
    address: string;
    city: string;
    lat: number;
    lng: number;
}
export declare class CreateBookingDto {
    proId: string;
    serviceId: string;
    scheduledFor?: string;
    isASAP: boolean;
    description: string;
    images?: string[];
    location: LocationDto;
}
export declare class UpdateBookingStatusDto {
    status: string;
    reason?: string;
}
export declare class DeclineBookingDto {
    reason: string;
}
export {};
