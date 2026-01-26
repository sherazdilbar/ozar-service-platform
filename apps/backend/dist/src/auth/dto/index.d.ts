export declare class LocationDto {
    city: string;
    area?: string;
    lat: number;
    lng: number;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'CUSTOMER' | 'PRO';
    location?: LocationDto;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
export * from './password-reset.dto';
