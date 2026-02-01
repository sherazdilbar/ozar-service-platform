"use strict";
/**
 * Real API Client for Ozar Backend
 * Connects to NestJS backend at http://localhost:4000/api/v1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsApi = exports.uploadApi = exports.bookingPhotosApi = exports.serviceAreaApi = exports.templatesApi = exports.certificationsApi = exports.availabilityApi = exports.analyticsApi = exports.reviewsApi = exports.favoritesApi = exports.notificationsApi = exports.adminApi = exports.chatApi = exports.categoriesApi = exports.servicesApi = exports.bookingsApi = exports.prosApi = exports.authApi = exports.usersApi = void 0;
exports.setTokens = setTokens;
exports.getAccessToken = getAccessToken;
exports.clearTokens = clearTokens;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api/v1';
// Token management - works for both web and React Native
let accessToken = null;
let refreshToken = null;
// Storage adapter for cross-platform support
let storageAdapter = null;
// Initialize storage adapter
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    // Web environment
    storageAdapter = {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
    };
}
else {
    // React Native environment - try to load AsyncStorage
    try {
        // Use dynamic import to avoid build errors in web
        if (typeof require !== 'undefined') {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            storageAdapter = AsyncStorage;
        }
    }
    catch (e) {
        // AsyncStorage not available - this is fine for web builds
        console.log('[API Client] Running in web environment without AsyncStorage');
    }
}
function setTokens(access, refresh) {
    console.log('[API Client] Setting tokens, access token length:', access?.length);
    accessToken = access;
    refreshToken = refresh;
    // Store in persistent storage if available
    if (storageAdapter) {
        try {
            storageAdapter.setItem('accessToken', access);
            storageAdapter.setItem('refreshToken', refresh);
            console.log('[API Client] Tokens saved to storage');
        }
        catch (e) {
            console.error('[API Client] Failed to save tokens:', e);
        }
    }
}
function getAccessToken() {
    // Always return in-memory token if available
    if (accessToken) {
        return accessToken;
    }
    // Try to load from storage
    if (storageAdapter) {
        try {
            const storedToken = storageAdapter.getItem('accessToken');
            if (storedToken) {
                console.log('[API Client] Loaded token from storage');
                accessToken = storedToken; // Cache it in memory
                return storedToken;
            }
        }
        catch (e) {
            console.error('[API Client] Failed to load token from storage:', e);
        }
    }
    console.log('[API Client] No token available');
    return null;
}
function clearTokens() {
    console.log('[API Client] Clearing all tokens');
    accessToken = null;
    refreshToken = null;
    if (storageAdapter) {
        try {
            storageAdapter.removeItem('accessToken');
            storageAdapter.removeItem('refreshToken');
            console.log('[API Client] Tokens cleared from storage');
        }
        catch (e) {
            console.error('[API Client] Failed to clear tokens:', e);
        }
    }
}
// HTTP client with auth
async function apiRequest(endpoint, options = {}) {
    const token = getAccessToken();
    console.log(`[API Client] Request to ${endpoint}`);
    console.log(`[API Client] Has token:`, !!token);
    console.log(`[API Client] Token value:`, token ? `${token.substring(0, 20)}...` : 'null');
    const headers = {};
    // Only set Content-Type if not FormData (FormData sets its own with boundary)
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    if (options.headers) {
        Object.assign(headers, options.headers);
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`[API Client] Authorization header set`);
    }
    else {
        console.warn(`[API Client] NO TOKEN - Request will be unauthorized!`);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error(`[API Client] Request failed: ${response.status}`, error);
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
}
// Users API
exports.usersApi = {
    async updateProfile(data) {
        return apiRequest('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};
// Auth API
exports.authApi = {
    async register(data) {
        const result = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        setTokens(result.accessToken, result.refreshToken);
        return result;
    },
    async login(email, password) {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setTokens(result.accessToken, result.refreshToken);
        return result;
    },
    async logout() {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        }
        finally {
            clearTokens();
        }
    },
    async refreshAccessToken() {
        const refresh = typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : refreshToken;
        if (!refresh)
            throw new Error('No refresh token');
        const result = await apiRequest('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: refresh }),
        });
        setTokens(result.accessToken, result.refreshToken);
        return result;
    },
};
// Pros API
exports.prosApi = {
    async getPros(filters) {
        const params = new URLSearchParams();
        if (filters?.category)
            params.append('categoryId', filters.category); // Backend expects 'categoryId'
        if (filters?.city)
            params.append('city', filters.city);
        if (filters?.lat)
            params.append('lat', filters.lat.toString());
        if (filters?.lng)
            params.append('lng', filters.lng.toString());
        if (filters?.radiusKm)
            params.append('radiusKm', filters.radiusKm.toString());
        if (filters?.availableNow)
            params.append('availableNow', 'true');
        if (filters?.minRating)
            params.append('minRating', filters.minRating.toString());
        if (filters?.searchTerm)
            params.append('searchTerm', filters.searchTerm);
        const query = params.toString();
        return apiRequest(`/pros${query ? `?${query}` : ''}`);
    },
    async getProById(id) {
        return apiRequest(`/pros/${id}`);
    },
    async createProProfile(data) {
        return apiRequest('/pros', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async updateProProfile(id, data) {
        return apiRequest(`/pros/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    async getProReviews(id) {
        return apiRequest(`/pros/${id}/reviews`);
    },
    async getMyProfile() {
        return apiRequest('/pros/me/profile');
    },
    async updateProfile(data) {
        return apiRequest('/pros/me/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Onboarding methods
    async getOnboardingStatus() {
        return apiRequest('/pros/me/onboarding-status');
    },
    async updateOnboardingStep(step) {
        return apiRequest('/pros/me/onboarding-step', {
            method: 'PUT',
            body: JSON.stringify({ step }),
        });
    },
    async completeOnboarding() {
        return apiRequest('/pros/me/complete-onboarding', {
            method: 'POST',
        });
    },
    // Portfolio methods
    async getPortfolio(proId) {
        return apiRequest(`/pros/${proId}/portfolio`);
    },
    async addPortfolioItem(proId, data) {
        return apiRequest(`/pros/${proId}/portfolio`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async deletePortfolioItem(itemId) {
        return apiRequest(`/pros/portfolio/${itemId}`, {
            method: 'DELETE',
        });
    },
};
// Bookings API
exports.bookingsApi = {
    async createBooking(data) {
        return apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async getBookings(status) {
        const params = status ? `?status=${status}` : '';
        return apiRequest(`/bookings${params}`);
    },
    async getBookingById(id) {
        return apiRequest(`/bookings/${id}`);
    },
    async updateBookingStatus(id, status, reason) {
        return apiRequest(`/bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, reason }),
        });
    },
    async acceptBooking(id) {
        return apiRequest(`/bookings/${id}/accept`, {
            method: 'POST',
        });
    },
    async declineBooking(id, reason) {
        return apiRequest(`/bookings/${id}/decline`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },
    async getAvailableSlots(proId, date, serviceId) {
        return apiRequest(`/bookings/available-slots/${proId}?date=${date}&serviceId=${serviceId}`);
    },
    async startJob(bookingId) {
        return apiRequest(`/bookings/${bookingId}/start`, {
            method: 'POST',
        });
    },
    async completeJob(bookingId) {
        return apiRequest(`/bookings/${bookingId}/complete`, {
            method: 'POST',
        });
    },
    async createReview(bookingId, rating, comment, images) {
        return apiRequest(`/bookings/${bookingId}/review`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment, images }),
        });
    },
    async cancelBooking(bookingId, reason) {
        return apiRequest(`/bookings/${bookingId}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },
    async updateBookingNotes(bookingId, notes) {
        return apiRequest(`/bookings/${bookingId}/notes`, {
            method: 'PUT',
            body: JSON.stringify({ notes }),
        });
    },
};
// Services API
exports.servicesApi = {
    async getServices(proId) {
        const params = proId ? `?proId=${proId}` : '';
        return apiRequest(`/services${params}`);
    },
    async getMyServices() {
        return apiRequest('/services/me');
    },
    async createService(data) {
        return apiRequest('/services', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async deleteService(serviceId) {
        return apiRequest(`/services/${serviceId}`, {
            method: 'DELETE',
        });
    },
    async updateService(serviceId, data) {
        return apiRequest(`/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    async toggleServiceStatus(serviceId) {
        return apiRequest(`/services/${serviceId}/toggle-status`, {
            method: 'PUT',
        });
    },
};
// Categories API
exports.categoriesApi = {
    async getCategories() {
        return apiRequest('/categories');
    },
};
// Chat API
exports.chatApi = {
    async getConversations() {
        return apiRequest('/chat/conversations');
    },
    async createConversation(data) {
        return apiRequest('/chat/conversations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async getOrCreateConversation(data) {
        return apiRequest('/chat/conversations/get-or-create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async getConversation(id) {
        return apiRequest(`/chat/conversations/${id}`);
    },
    async getMessages(conversationId, page = 1, limit = 50) {
        return apiRequest(`/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    },
    async sendMessage(conversationId, text, imageUrl) {
        return apiRequest(`/chat/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text, imageUrl }),
        });
    },
    async markAsRead(conversationId) {
        return apiRequest(`/chat/conversations/${conversationId}/read`, {
            method: 'POST',
        });
    },
};
// Admin API
exports.adminApi = {
    async getStats() {
        return apiRequest('/admin/stats');
    },
    async getPros(filters) {
        const params = new URLSearchParams();
        if (filters?.status)
            params.append('status', filters.status);
        if (filters?.city)
            params.append('city', filters.city);
        if (filters?.page)
            params.append('page', filters.page.toString());
        if (filters?.limit)
            params.append('limit', filters.limit.toString());
        const query = params.toString();
        return apiRequest(`/admin/pros${query ? `?${query}` : ''}`);
    },
    async verifyPro(proId, status, reason) {
        return apiRequest(`/admin/pros/${proId}/verify`, {
            method: 'PUT',
            body: JSON.stringify({ status, reason }),
        });
    },
    async getAllBookings(filters) {
        const params = new URLSearchParams();
        if (filters?.status)
            params.append('status', filters.status);
        if (filters?.page)
            params.append('page', filters.page.toString());
        if (filters?.limit)
            params.append('limit', filters.limit.toString());
        const query = params.toString();
        return apiRequest(`/admin/bookings${query ? `?${query}` : ''}`);
    },
    async getDisputes(filters) {
        const params = new URLSearchParams();
        if (filters?.status)
            params.append('status', filters.status);
        if (filters?.page)
            params.append('page', filters.page.toString());
        if (filters?.limit)
            params.append('limit', filters.limit.toString());
        const query = params.toString();
        return apiRequest(`/admin/disputes${query ? `?${query}` : ''}`);
    },
    async resolveDispute(disputeId, resolution, refundAmount) {
        return apiRequest(`/admin/disputes/${disputeId}/resolve`, {
            method: 'PUT',
            body: JSON.stringify({ resolution, refundAmount }),
        });
    },
};
// Notifications API
exports.notificationsApi = {
    async getNotifications(unreadOnly = false) {
        return apiRequest(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
    },
    async getUnreadCount() {
        return apiRequest('/notifications/unread-count');
    },
    async markAsRead(notificationId) {
        return apiRequest(`/notifications/${notificationId}/read`, {
            method: 'PUT',
        });
    },
    async markAllAsRead() {
        return apiRequest('/notifications/read-all', {
            method: 'PUT',
        });
    },
};
// Favorites API
exports.favoritesApi = {
    async getFavorites() {
        return apiRequest('/favorites');
    },
    async addFavorite(proId) {
        return apiRequest(`/favorites/${proId}`, {
            method: 'POST',
        });
    },
    async removeFavorite(proId) {
        return apiRequest(`/favorites/${proId}`, {
            method: 'DELETE',
        });
    },
    async isFavorite(proId) {
        return apiRequest(`/favorites/check/${proId}`);
    },
};
// Reviews API
exports.reviewsApi = {
    async getProReviews(proId, page = 1, limit = 10) {
        return apiRequest(`/reviews/pro/${proId}?page=${page}&limit=${limit}`);
    },
    async getMyReviews() {
        return apiRequest('/reviews/my-reviews');
    },
    async getReviewById(reviewId) {
        return apiRequest(`/reviews/${reviewId}`);
    },
    async respondToReview(reviewId, responseText) {
        return apiRequest(`/reviews/${reviewId}/respond`, {
            method: 'POST',
            body: JSON.stringify({ responseText }),
        });
    },
    async flagReview(reviewId, reason) {
        return apiRequest(`/reviews/${reviewId}/flag`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },
    async toggleHelpfulVote(reviewId) {
        return apiRequest(`/reviews/${reviewId}/helpful`, {
            method: 'POST',
        });
    },
    async isReviewHelpful(reviewId) {
        return apiRequest(`/reviews/${reviewId}/helpful/check`);
    },
};
// Analytics API
exports.analyticsApi = {
    async getProDashboard(period = 'month') {
        return apiRequest(`/analytics/pro/dashboard?period=${period}`);
    },
};
// Availability API
exports.availabilityApi = {
    getSchedule: () => apiRequest('/availability/schedule', { method: 'GET' }),
    updateSchedule: (schedules) => apiRequest('/availability/schedule', {
        method: 'PUT',
        body: JSON.stringify({ schedules }),
    }),
    getTimeOffs: () => apiRequest('/availability/time-off', { method: 'GET' }),
    addTimeOff: (data) => apiRequest('/availability/time-off', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    deleteTimeOff: (id) => apiRequest(`/availability/time-off/${id}`, { method: 'DELETE' }),
};
// Certifications API
exports.certificationsApi = {
    getCertifications: () => apiRequest('/certifications', { method: 'GET' }),
    addCertification: (data) => apiRequest('/certifications', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateCertification: (id, data) => apiRequest(`/certifications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteCertification: (id) => apiRequest(`/certifications/${id}`, { method: 'DELETE' }),
    getBadges: () => apiRequest('/certifications/badges', { method: 'GET' }),
};
// Templates API
exports.templatesApi = {
    getResponseTemplates: () => apiRequest('/templates/responses', { method: 'GET' }),
    createResponseTemplate: (data) => apiRequest('/templates/responses', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateResponseTemplate: (id, data) => apiRequest(`/templates/responses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteResponseTemplate: (id) => apiRequest(`/templates/responses/${id}`, { method: 'DELETE' }),
    getQuickMessages: () => apiRequest('/templates/quick-messages', { method: 'GET' }),
    createQuickMessage: (data) => apiRequest('/templates/quick-messages', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateQuickMessage: (id, data) => apiRequest(`/templates/quick-messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteQuickMessage: (id) => apiRequest(`/templates/quick-messages/${id}`, { method: 'DELETE' }),
};
// Service Area API
exports.serviceAreaApi = {
    getServiceAreas: () => apiRequest('/service-areas', { method: 'GET' }),
    addServiceArea: (data) => apiRequest('/service-areas', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateServiceArea: (id, data) => apiRequest(`/service-areas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteServiceArea: (id) => apiRequest(`/service-areas/${id}`, { method: 'DELETE' }),
    calculateTravelFee: (distance) => apiRequest(`/service-areas/calculate-travel-fee?distance=${distance}`, { method: 'GET' }),
};
// Booking Photos API
exports.bookingPhotosApi = {
    uploadPhoto: (bookingId, data) => apiRequest(`/bookings/${bookingId}/photos`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getPhotos: (bookingId) => apiRequest(`/bookings/${bookingId}/photos`, { method: 'GET' }),
};
// Upload API
exports.uploadApi = {
    async uploadImage(fileOrUri) {
        const formData = new FormData();
        // Handle React Native URI
        if (typeof fileOrUri === 'string') {
            const filename = fileOrUri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            formData.append('file', {
                uri: fileOrUri,
                name: filename,
                type,
            });
        }
        else {
            // Handle web File/Blob
            formData.append('file', fileOrUri);
        }
        const result = await apiRequest('/upload/image', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser/RN set Content-Type with boundary
        });
        return result.url;
    },
    async uploadImages(filesOrUris) {
        const formData = new FormData();
        filesOrUris.forEach((fileOrUri) => {
            if (typeof fileOrUri === 'string') {
                const filename = fileOrUri.split('/').pop() || 'image.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                formData.append('files', {
                    uri: fileOrUri,
                    name: filename,
                    type,
                });
            }
            else {
                formData.append('files', fileOrUri);
            }
        });
        const result = await apiRequest('/upload/images', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser/RN set Content-Type with boundary
        });
        return result.urls;
    },
};
// Jobs API (Job Posting & Bidding System)
exports.jobsApi = {
    // Customer: Create a job posting
    async createJob(data) {
        return apiRequest('/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Customer: Get my job postings
    async getMyJobs(status) {
        const params = status ? `?status=${status}` : '';
        return apiRequest(`/jobs/my-jobs${params}`);
    },
    // Pro: Get available jobs to bid on
    async getAvailableJobs(filters) {
        const params = new URLSearchParams();
        if (filters?.category)
            params.append('category', filters.category);
        const query = params.toString();
        return apiRequest(`/jobs/available${query ? `?${query}` : ''}`);
    },
    // Get single job details
    async getJobById(jobId) {
        return apiRequest(`/jobs/${jobId}`);
    },
    // Get single job details (alias for compatibility)
    async getJob(jobId) {
        return apiRequest(`/jobs/${jobId}`);
    },
    // Customer: Update a job
    async updateJob(jobId, data) {
        return apiRequest(`/jobs/${jobId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    // Customer: Cancel a job
    async cancelJob(jobId) {
        return apiRequest(`/jobs/${jobId}/cancel`, {
            method: 'POST',
        });
    },
    // Pro: Submit a bid
    async createBid(data) {
        return apiRequest('/jobs/bids', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Pro: Submit a bid (alias for web app compatibility)
    async submitBid(jobId, bidData) {
        return apiRequest('/jobs/bids', {
            method: 'POST',
            body: JSON.stringify({
                jobId,
                ...bidData,
            }),
        });
    },
    // Pro: Get my bids
    async getMyBids(status) {
        const params = status ? `?status=${status}` : '';
        return apiRequest(`/jobs/bids/my-bids${params}`);
    },
    // Get single bid details
    async getBid(bidId) {
        return apiRequest(`/jobs/bids/${bidId}`);
    },
    // Pro: Update a bid
    async updateBid(bidId, data) {
        return apiRequest(`/jobs/bids/${bidId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    // Pro: Withdraw a bid
    async withdrawBid(bidId) {
        return apiRequest(`/jobs/bids/${bidId}/withdraw`, {
            method: 'POST',
        });
    },
    // Customer: Accept a bid
    async acceptBid(jobId, bidId) {
        return apiRequest(`/jobs/bids/${bidId}/accept`, {
            method: 'POST',
        });
    },
    // Customer: Reject a bid
    async rejectBid(jobId, bidId) {
        return apiRequest(`/jobs/bids/${bidId}/reject`, {
            method: 'POST',
        });
    },
};
//# sourceMappingURL=apiClient.js.map