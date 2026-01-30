/**
 * Real API Client for Ozar Backend
 * Connects to NestJS backend at http://localhost:4000/api/v1
 */
export declare function setTokens(access: string, refresh: string): void;
export declare function getAccessToken(): string | null;
export declare function clearTokens(): void;
export declare const usersApi: {
    updateProfile(data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        bio?: string;
        avatar?: string;
    }): Promise<any>;
};
export declare const authApi: {
    register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: "CUSTOMER" | "PRO";
        location?: {
            city: string;
            area?: string;
            lat: number;
            lng: number;
        };
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
    getOnboardingStatus(): Promise<{
        completed: boolean;
        currentStep: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    updateOnboardingStep(step: string): Promise<{
        success: boolean;
        currentStep: string;
    }>;
    completeOnboarding(): Promise<{
        success: boolean;
        message: string;
    }>;
    getPortfolio(proId: string): Promise<any>;
    addPortfolioItem(proId: string, data: {
        imageUrl: string;
        title: string;
        description: string;
        category: string;
    }): Promise<any>;
    deletePortfolioItem(itemId: string): Promise<any>;
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
    createReview(bookingId: string, rating: number, comment: string, images?: string[]): Promise<any>;
    cancelBooking(bookingId: string, reason: string): Promise<any>;
    updateBookingNotes(bookingId: string, notes: string): Promise<any>;
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
    toggleServiceStatus(serviceId: string): Promise<any>;
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
    getOrCreateConversation(data: {
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
export declare const favoritesApi: {
    getFavorites(): Promise<any>;
    addFavorite(proId: string): Promise<any>;
    removeFavorite(proId: string): Promise<any>;
    isFavorite(proId: string): Promise<any>;
};
export declare const reviewsApi: {
    getProReviews(proId: string, page?: number, limit?: number): Promise<any>;
    getMyReviews(): Promise<any>;
    getReviewById(reviewId: string): Promise<any>;
    respondToReview(reviewId: string, responseText: string): Promise<any>;
    flagReview(reviewId: string, reason: string): Promise<any>;
    toggleHelpfulVote(reviewId: string): Promise<any>;
    isReviewHelpful(reviewId: string): Promise<any>;
};
export declare const analyticsApi: {
    getProDashboard(period?: "week" | "month" | "year"): Promise<any>;
};
export declare const availabilityApi: {
    getSchedule: () => Promise<unknown>;
    updateSchedule: (schedules: any[]) => Promise<unknown>;
    getTimeOffs: () => Promise<unknown>;
    addTimeOff: (data: any) => Promise<unknown>;
    deleteTimeOff: (id: string) => Promise<unknown>;
};
export declare const certificationsApi: {
    getCertifications: () => Promise<unknown>;
    addCertification: (data: any) => Promise<unknown>;
    updateCertification: (id: string, data: any) => Promise<unknown>;
    deleteCertification: (id: string) => Promise<unknown>;
    getBadges: () => Promise<unknown>;
};
export declare const templatesApi: {
    getResponseTemplates: () => Promise<unknown>;
    createResponseTemplate: (data: any) => Promise<unknown>;
    updateResponseTemplate: (id: string, data: any) => Promise<unknown>;
    deleteResponseTemplate: (id: string) => Promise<unknown>;
    getQuickMessages: () => Promise<unknown>;
    createQuickMessage: (data: any) => Promise<unknown>;
    updateQuickMessage: (id: string, data: any) => Promise<unknown>;
    deleteQuickMessage: (id: string) => Promise<unknown>;
};
export declare const serviceAreaApi: {
    getServiceAreas: () => Promise<unknown>;
    addServiceArea: (data: any) => Promise<unknown>;
    updateServiceArea: (id: string, data: any) => Promise<unknown>;
    deleteServiceArea: (id: string) => Promise<unknown>;
    calculateTravelFee: (distance: number) => Promise<unknown>;
};
export declare const bookingPhotosApi: {
    uploadPhoto: (bookingId: string, data: any) => Promise<unknown>;
    getPhotos: (bookingId: string) => Promise<unknown>;
};
export declare const uploadApi: {
    uploadImage(fileOrUri: File | Blob | string): Promise<string>;
    uploadImages(filesOrUris: (File | Blob | string)[]): Promise<string[]>;
};
export declare const jobsApi: {
    createJob(data: {
        title: string;
        description: string;
        category: string;
        urgency?: "ASAP" | "THIS_WEEK" | "FLEXIBLE";
        locationAddr: string;
        locationCity: string;
        locationArea?: string;
        locationLat: number;
        locationLng: number;
        budgetMin?: number;
        budgetMax?: number;
        images?: string[];
        preferredDate?: string;
    }): Promise<any>;
    getMyJobs(status?: string): Promise<any>;
    getAvailableJobs(filters?: {
        category?: string;
    }): Promise<any>;
    getJobById(jobId: string): Promise<any>;
    getJob(jobId: string): Promise<any>;
    updateJob(jobId: string, data: {
        description?: string;
        urgency?: "ASAP" | "THIS_WEEK" | "FLEXIBLE";
        budgetMin?: number;
        budgetMax?: number;
        images?: string[];
        preferredDate?: string;
    }): Promise<any>;
    cancelJob(jobId: string): Promise<any>;
    createBid(data: {
        jobId: string;
        proposedPrice: number;
        estimatedDuration: number;
        message: string;
        availableFrom?: string;
    }): Promise<any>;
    submitBid(jobId: string, bidData: {
        proposedPrice: number;
        estimatedDuration: number;
        message: string;
        availableFrom?: string;
    }): Promise<any>;
    getMyBids(status?: string): Promise<any>;
    getBid(bidId: string): Promise<any>;
    updateBid(bidId: string, data: {
        proposedPrice?: number;
        estimatedDuration?: number;
        message?: string;
        availableFrom?: string;
    }): Promise<any>;
    withdrawBid(bidId: string): Promise<any>;
    acceptBid(jobId: string, bidId: string): Promise<any>;
    rejectBid(jobId: string, bidId: string): Promise<any>;
};
//# sourceMappingURL=apiClient.d.ts.map