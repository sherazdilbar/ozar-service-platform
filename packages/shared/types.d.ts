export declare enum BookingStatus {
    DRAFT = "DRAFT",
    REQUESTED = "REQUESTED",
    OFFERED = "OFFERED",
    ACCEPTED = "ACCEPTED",
    PAYMENT_AUTHORIZED = "PAYMENT_AUTHORIZED",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CAPTURED = "CAPTURED",
    CANCELLED_BY_CUSTOMER = "CANCELLED_BY_CUSTOMER",
    CANCELLED_BY_PRO = "CANCELLED_BY_PRO",
    NO_SHOW = "NO_SHOW",
    DISPUTED = "DISPUTED",
    REFUNDED = "REFUNDED"
}
export declare enum UserRole {
    CUSTOMER = "CUSTOMER",
    PRO = "PRO",
    ADMIN = "ADMIN"
}
export declare enum ServiceCategory {
    ELECTRICIAN = "ELECTRICIAN",
    PLUMBER = "PLUMBER",
    HANDYMAN = "HANDYMAN",
    HVAC_AC_REPAIR = "HVAC_AC_REPAIR",
    APPLIANCE_REPAIR = "APPLIANCE_REPAIR",
    GAS_TECHNICIAN = "GAS_TECHNICIAN",
    PAINTING = "PAINTING",
    FLOORING = "FLOORING",
    TILE_WORK = "TILE_WORK",
    KITCHEN_BATHROOM_REMODELING = "KITCHEN_BATHROOM_REMODELING",
    DOOR_WINDOW_INSTALLATION = "DOOR_WINDOW_INSTALLATION",
    GARDENING_LAWN_MOWING = "GARDENING_LAWN_MOWING",
    TREE_TRIMMING = "TREE_TRIMMING",
    FENCE_INSTALLATION = "FENCE_INSTALLATION",
    PRESSURE_WASHING = "PRESSURE_WASHING",
    SNOW_REMOVAL = "SNOW_REMOVAL",
    HOME_CLEANING = "HOME_CLEANING",
    DEEP_CLEANING = "DEEP_CLEANING",
    OFFICE_CLEANING = "OFFICE_CLEANING",
    MOVE_IN_OUT_CLEANING = "MOVE_IN_OUT_CLEANING",
    CARPET_SOFA_CLEANING = "CARPET_SOFA_CLEANING",
    POST_CONSTRUCTION_CLEANING = "POST_CONSTRUCTION_CLEANING",
    HAIRCUT = "HAIRCUT",
    HAIRSTYLIST = "HAIRSTYLIST",
    BARBER = "BARBER",
    BEARD_GROOMING = "BEARD_GROOMING",
    MANICURE_PEDICURE = "MANICURE_PEDICURE",
    MAKEUP_ARTIST = "MAKEUP_ARTIST",
    NAIL_TECHNICIAN = "NAIL_TECHNICIAN",
    EYELASH_EYEBROW_SERVICES = "EYELASH_EYEBROW_SERVICES",
    MASSAGE_THERAPY = "MASSAGE_THERAPY",
    PHYSIOTHERAPY = "PHYSIOTHERAPY",
    YOGA_INSTRUCTOR = "YOGA_INSTRUCTOR",
    PERSONAL_TRAINER = "PERSONAL_TRAINER",
    TV_MOUNTING = "TV_MOUNTING",
    WIFI_SETUP = "WIFI_SETUP",
    SMART_HOME_INSTALLATION = "SMART_HOME_INSTALLATION",
    CCTV_INSTALLATION = "CCTV_INSTALLATION",
    COMPUTER_LAPTOP_REPAIR = "COMPUTER_LAPTOP_REPAIR",
    PRINTER_SETUP = "PRINTER_SETUP",
    HOUSE_SHIFTING = "HOUSE_SHIFTING",
    FURNITURE_MOVING = "FURNITURE_MOVING",
    SMALL_DELIVERIES = "SMALL_DELIVERIES",
    PACKING_UNPACKING = "PACKING_UNPACKING",
    JUNK_REMOVAL = "JUNK_REMOVAL",
    COOKING_HOME_CHEF = "COOKING_HOME_CHEF",
    MEAL_PREP = "MEAL_PREP",
    BABYSITTING = "BABYSITTING",
    ELDERLY_CARE = "ELDERLY_CARE",
    HOME_HELPER = "HOME_HELPER",
    DOG_WALKING = "DOG_WALKING",
    PET_SITTING = "PET_SITTING",
    PET_GROOMING = "PET_GROOMING",
    VET_VISIT_ASSISTANCE = "VET_VISIT_ASSISTANCE",
    PARTY_DECORATORS = "PARTY_DECORATORS",
    CATERERS = "CATERERS",
    DJS = "DJS",
    PHOTOGRAPHERS = "PHOTOGRAPHERS",
    VIDEOGRAPHERS = "VIDEOGRAPHERS",
    HOME_TUTORS = "HOME_TUTORS",
    MUSIC_TEACHERS = "MUSIC_TEACHERS",
    LANGUAGE_TUTORS = "LANGUAGE_TUTORS",
    FITNESS_TRAINERS = "FITNESS_TRAINERS",
    FURNITURE_ASSEMBLY = "FURNITURE_ASSEMBLY",
    MOUNTING_DRILLING = "MOUNTING_DRILLING",
    SMALL_FIXES = "SMALL_FIXES",
    EMERGENCY_ELECTRICIAN = "EMERGENCY_ELECTRICIAN",
    EMERGENCY_PLUMBER = "EMERGENCY_PLUMBER"
}
export declare enum PricingModel {
    HOURLY = "HOURLY",
    FIXED = "FIXED",
    INSPECTION = "INSPECTION"
}
export declare enum VerificationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum AvailabilityStatus {
    AVAILABLE_NOW = "AVAILABLE_NOW",
    AVAILABLE_SOON = "AVAILABLE_SOON",
    BUSY = "BUSY",
    OFFLINE = "OFFLINE"
}
export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: UserRole;
    createdAt: string;
    location?: {
        city: string;
        area: string;
        lat: number;
        lng: number;
    };
}
export interface Service {
    id: string;
    name: string;
    description: string;
    category: ServiceCategory;
    pricingModel: PricingModel;
    price: number;
    duration: number;
    currency: string;
}
export interface PortfolioItem {
    id: string;
    proId: string;
    imageUrl: string;
    title: string;
    description: string;
    category: ServiceCategory;
    createdAt: string;
}
export interface Review {
    id: string;
    bookingId: string;
    proId: string;
    customerId: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string;
    response?: {
        text: string;
        createdAt: string;
    };
}
export interface ProProfile {
    id: string;
    userId: string;
    user: User;
    businessName?: string;
    bio: string;
    categories: ServiceCategory[];
    services: Service[];
    portfolio: PortfolioItem[];
    rating: number;
    reviewCount: number;
    jobsCompleted: number;
    yearsExperience: number;
    verificationStatus: VerificationStatus;
    availabilityStatus: AvailabilityStatus;
    serviceArea: {
        city: string;
        radiusKm: number;
    };
    location: {
        city: string;
        area: string;
        lat: number;
        lng: number;
    };
    startingPrice: number;
    currency: string;
    responseTime: number;
    createdAt: string;
}
export interface Booking {
    id: string;
    customerId: string;
    proId: string;
    serviceId: string;
    status: BookingStatus;
    service: Service;
    pro: ProProfile;
    customer: User;
    scheduledFor?: string;
    isASAP: boolean;
    description: string;
    images: string[];
    location: {
        address: string;
        city: string;
        lat: number;
        lng: number;
    };
    pricing: {
        servicePrice: number;
        platformFee: number;
        total: number;
        currency: string;
    };
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    events?: BookingEvent[];
    review?: Review;
}
export interface BookingEvent {
    id: string;
    bookingId: string;
    status: BookingStatus;
    createdAt: string;
    note?: string;
}
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    imageUrl?: string;
    createdAt: string;
    read: boolean;
}
export interface Conversation {
    id: string;
    customerId: string;
    proId: string;
    bookingId?: string;
    lastMessage?: Message;
    unreadCount: number;
    customer: User;
    pro: ProProfile;
    createdAt: string;
    updatedAt: string;
}
export interface PaymentIntent {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
    createdAt: string;
}
export interface AvailabilitySlot {
    id: string;
    proId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
export interface ProDashboard {
    proId: string;
    todaySchedule: Booking[];
    pendingRequests: Booking[];
    earnings: {
        today: number;
        week: number;
        month: number;
        currency: string;
    };
    stats: {
        activeBookings: number;
        completedToday: number;
        rating: number;
        responseRate: number;
    };
}
export interface ProFilters {
    category?: ServiceCategory;
    city?: string;
    availableNow?: boolean;
    maxDistance?: number;
    minRating?: number;
    maxPrice?: number;
    searchTerm?: string;
    location?: {
        lat: number;
        lng: number;
    };
}
