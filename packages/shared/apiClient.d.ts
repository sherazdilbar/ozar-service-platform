export declare function setTokens(access: string, refresh: string): void;
export declare function getAccessToken(): string | null;
export declare function clearTokens(): void;
export declare const authApi: {
    register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "CUSTOMER" | "PRO";
    }): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(): Promise<void>;
    refreshAccessToken(): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
};
export declare const prosApi: {
    getPros(filters?: {
        category?: string;
        city?: string;
        lat?: number;
        lng?: number;
        radiusKm?: number;
        availableNow?: boolean;
        minRating?: number;
        searchTerm?: string;
    }): Promise<any>;
    getProById(id: string): Promise<any>;
    createProProfile(data: any): Promise<any>;
    updateProProfile(id: string, data: any): Promise<any>;
    getProReviews(id: string): Promise<any>;
    getMyProfile(): Promise<any>;
    updateProfile(data: any): Promise<any>;
};
export declare const bookingsApi: {
    createBooking(data: {
        proId: string;
        serviceId: string;
        scheduledFor?: string;
        isASAP: boolean;
        description: string;
        images?: string[];
        location: {
            address: string;
            city: string;
            lat: number;
            lng: number;
        };
    }): Promise<any>;
    getBookings(status?: string): Promise<any>;
    getBookingById(id: string): Promise<any>;
    updateBookingStatus(id: string, status: string, reason?: string): Promise<any>;
    acceptBooking(id: string): Promise<any>;
    declineBooking(id: string, reason: string): Promise<any>;
    getAvailableSlots(proId: string, date: string, serviceId: string): Promise<any>;
    startJob(bookingId: string): Promise<any>;
    completeJob(bookingId: string): Promise<any>;
    createReview(bookingId: string, rating: number, comment: string): Promise<any>;
};
export declare const servicesApi: {
    getServices(proId?: string): Promise<any>;
    getMyServices(): Promise<any>;
    createService(data: {
        name: string;
        description: string;
        category: string;
        pricingModel: string;
        price: number;
        duration: number;
        currency: string;
    }): Promise<any>;
    deleteService(serviceId: string): Promise<any>;
    updateService(serviceId: string, data: {
        name: string;
        description: string;
        category: string;
        pricingModel: string;
        price: number;
        duration: number;
        currency: string;
    }): Promise<any>;
};
export declare const categoriesApi: {
    getCategories(): Promise<any>;
};
export declare const chatApi: {
    getConversations(): Promise<any>;
    createConversation(data: {
        customerId: string;
        proId: string;
        bookingId?: string;
    }): Promise<any>;
    getConversation(id: string): Promise<any>;
    getMessages(conversationId: string, page?: number, limit?: number): Promise<any>;
    sendMessage(conversationId: string, text: string, imageUrl?: string): Promise<any>;
    markAsRead(conversationId: string): Promise<any>;
};
export declare const adminApi: {
    getStats(): Promise<any>;
    getPros(filters?: {
        status?: string;
        city?: string;
        page?: number;
        limit?: number;
    }): Promise<any>;
    verifyPro(proId: string, status: "APPROVED" | "REJECTED", reason?: string): Promise<any>;
    getAllBookings(filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<any>;
    getDisputes(filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<any>;
    resolveDispute(disputeId: string, resolution: string, refundAmount?: number): Promise<any>;
};
export declare const notificationsApi: {
    getNotifications(unreadOnly?: boolean): Promise<any>;
    getUnreadCount(): Promise<any>;
    markAsRead(notificationId: string): Promise<any>;
    markAllAsRead(): Promise<any>;
};
