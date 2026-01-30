import { ProProfile, Booking, Review, Conversation, Message, ProDashboard, ProFilters, AvailabilitySlot, PaymentIntent } from './types';
export declare function getPros(filters?: ProFilters): Promise<ProProfile[]>;
export declare function getProById(proId: string): Promise<ProProfile | null>;
export declare function getReviews(proId: string): Promise<Review[]>;
export declare function createBooking(payload: {
    customerId: string;
    proId: string;
    serviceId: string;
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
}): Promise<Booking>;
export declare function getBookings(userId: string, role?: 'customer' | 'pro'): Promise<Booking[]>;
export declare function getBookingById(bookingId: string): Promise<Booking | null>;
export declare function authorizePayment(bookingId: string): Promise<PaymentIntent>;
export declare function cancelBooking(bookingId: string, reason: string, cancelledBy: 'customer' | 'pro'): Promise<Booking>;
export declare function getConversations(userId: string): Promise<Conversation[]>;
export declare function getMessages(conversationId: string): Promise<Message[]>;
export declare function sendMessage(conversationId: string, senderId: string, text: string, imageUrl?: string): Promise<Message>;
export declare function getProDashboard(proId: string): Promise<ProDashboard>;
export declare function respondToBooking(bookingId: string, action: 'accept' | 'decline', counterOffer?: {
    price: number;
    scheduledFor?: string;
}): Promise<Booking>;
export declare function updateAvailability(proId: string, slots: AvailabilitySlot[]): Promise<AvailabilitySlot[]>;
export declare function getAvailability(proId: string): Promise<AvailabilitySlot[]>;
export declare function submitReview(bookingId: string, proId: string, customerId: string, rating: number, comment: string): Promise<Review>;
//# sourceMappingURL=api.d.ts.map