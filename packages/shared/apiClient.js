"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsApi = exports.adminApi = exports.chatApi = exports.categoriesApi = exports.servicesApi = exports.bookingsApi = exports.prosApi = exports.authApi = void 0;
exports.setTokens = setTokens;
exports.getAccessToken = getAccessToken;
exports.clearTokens = clearTokens;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api/v1';
let accessToken = null;
let refreshToken = null;
function setTokens(access, refresh) {
    accessToken = access;
    refreshToken = refresh;
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    }
}
function getAccessToken() {
    if (!accessToken && typeof window !== 'undefined') {
        accessToken = localStorage.getItem('accessToken');
    }
    return accessToken;
}
function clearTokens() {
    accessToken = null;
    refreshToken = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}
async function apiRequest(endpoint, options = {}) {
    const token = getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (options.headers) {
        Object.assign(headers, options.headers);
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
}
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
exports.prosApi = {
    async getPros(filters) {
        const params = new URLSearchParams();
        if (filters?.category)
            params.append('category', filters.category);
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
};
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
    async createReview(bookingId, rating, comment) {
        return apiRequest(`/bookings/${bookingId}/review`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment }),
        });
    },
};
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
};
exports.categoriesApi = {
    async getCategories() {
        return apiRequest('/categories');
    },
};
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
//# sourceMappingURL=apiClient.js.map