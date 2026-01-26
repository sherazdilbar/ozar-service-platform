/**
 * Real API Client for Ozar Backend
 * Connects to NestJS backend at http://localhost:4000/api/v1
 */

const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://localhost:4000/api/v1';

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
}

export function getAccessToken(): string | null {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// HTTP client with auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
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

// Auth API
export const authApi = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'CUSTOMER' | 'PRO';
    location?: {
      city: string;
      area?: string;
      lat: number;
      lng: number;
    };
  }) {
    const result = await apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    setTokens(result.accessToken, result.refreshToken);
    return result;
  },

  async login(email: string, password: string) {
    const result = await apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setTokens(result.accessToken, result.refreshToken);
    return result;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  async refreshAccessToken() {
    const refresh = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : refreshToken;
    
    if (!refresh) throw new Error('No refresh token');

    const result = await apiRequest<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refresh }),
    });
    
    setTokens(result.accessToken, result.refreshToken);
    return result;
  },
};

// Pros API
export const prosApi = {
  async getPros(filters?: {
    category?: string;
    city?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    availableNow?: boolean;
    minRating?: number;
    searchTerm?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('categoryId', filters.category); // Backend expects 'categoryId'
    if (filters?.city) params.append('city', filters.city);
    if (filters?.lat) params.append('lat', filters.lat.toString());
    if (filters?.lng) params.append('lng', filters.lng.toString());
    if (filters?.radiusKm) params.append('radiusKm', filters.radiusKm.toString());
    if (filters?.availableNow) params.append('availableNow', 'true');
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const query = params.toString();
    return apiRequest<any>(`/pros${query ? `?${query}` : ''}`);
  },

  async getProById(id: string) {
    return apiRequest<any>(`/pros/${id}`);
  },

  async createProProfile(data: any) {
    return apiRequest<any>('/pros', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProProfile(id: string, data: any) {
    return apiRequest<any>(`/pros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getProReviews(id: string) {
    return apiRequest<any>(`/pros/${id}/reviews`);
  },

  async getMyProfile() {
    return apiRequest<any>('/pros/me/profile');
  },

  async updateProfile(data: any) {
    return apiRequest<any>('/pros/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Onboarding methods
  async getOnboardingStatus() {
    return apiRequest<{
      completed: boolean;
      currentStep: string | null;
      startedAt: Date | null;
      completedAt: Date | null;
    }>('/pros/me/onboarding-status');
  },

  async updateOnboardingStep(step: string) {
    return apiRequest<{ success: boolean; currentStep: string }>('/pros/me/onboarding-step', {
      method: 'PUT',
      body: JSON.stringify({ step }),
    });
  },

  async completeOnboarding() {
    return apiRequest<{ success: boolean; message: string }>('/pros/me/complete-onboarding', {
      method: 'POST',
    });
  },
};

// Bookings API
export const bookingsApi = {
  async createBooking(data: {
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
  }) {
    return apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBookings(status?: string) {
    const params = status ? `?status=${status}` : '';
    return apiRequest<any>(`/bookings${params}`);
  },

  async getBookingById(id: string) {
    return apiRequest<any>(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string, reason?: string) {
    return apiRequest<any>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  },

  async acceptBooking(id: string) {
    return apiRequest<any>(`/bookings/${id}/accept`, {
      method: 'POST',
    });
  },

  async declineBooking(id: string, reason: string) {
    return apiRequest<any>(`/bookings/${id}/decline`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async getAvailableSlots(proId: string, date: string, serviceId: string) {
    return apiRequest<any>(
      `/bookings/available-slots/${proId}?date=${date}&serviceId=${serviceId}`
    );
  },

  async startJob(bookingId: string) {
    return apiRequest<any>(`/bookings/${bookingId}/start`, {
      method: 'POST',
    });
  },

  async completeJob(bookingId: string) {
    return apiRequest<any>(`/bookings/${bookingId}/complete`, {
      method: 'POST',
    });
  },

  async createReview(bookingId: string, rating: number, comment: string) {
    return apiRequest<any>(`/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};

// Services API
export const servicesApi = {
  async getServices(proId?: string) {
    const params = proId ? `?proId=${proId}` : '';
    return apiRequest<any>(`/services${params}`);
  },

  async getMyServices() {
    return apiRequest<any>('/services/me');
  },

  async createService(data: {
    name: string;
    description: string;
    category: string;
    pricingModel: string;
    price: number;
    duration: number;
    currency: string;
  }) {
    return apiRequest<any>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteService(serviceId: string) {
    return apiRequest<any>(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  },

  async updateService(serviceId: string, data: {
    name: string;
    description: string;
    category: string;
    pricingModel: string;
    price: number;
    duration: number;
    currency: string;
  }) {
    return apiRequest<any>(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Categories API
export const categoriesApi = {
  async getCategories() {
    return apiRequest<any>('/categories');
  },
};

// Chat API
export const chatApi = {
  async getConversations() {
    return apiRequest<any>('/chat/conversations');
  },

  async createConversation(data: {
    customerId: string;
    proId: string;
    bookingId?: string;
  }) {
    return apiRequest<any>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getConversation(id: string) {
    return apiRequest<any>(`/chat/conversations/${id}`);
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return apiRequest<any>(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
  },

  async sendMessage(conversationId: string, text: string, imageUrl?: string) {
    return apiRequest<any>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, imageUrl }),
    });
  },

  async markAsRead(conversationId: string) {
    return apiRequest<any>(`/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  },
};


// Admin API
export const adminApi = {
  async getStats() {
    return apiRequest<any>('/admin/stats');
  },

  async getPros(filters?: {
    status?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    return apiRequest<any>(`/admin/pros${query ? `?${query}` : ''}`);
  },

  async verifyPro(proId: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    return apiRequest<any>(`/admin/pros/${proId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  },

  async getAllBookings(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    return apiRequest<any>(`/admin/bookings${query ? `?${query}` : ''}`);
  },

  async getDisputes(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    return apiRequest<any>(`/admin/disputes${query ? `?${query}` : ''}`);
  },

  async resolveDispute(disputeId: string, resolution: string, refundAmount?: number) {
    return apiRequest<any>(`/admin/disputes/${disputeId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolution, refundAmount }),
    });
  },
};

// Notifications API
export const notificationsApi = {
  async getNotifications(unreadOnly = false) {
    return apiRequest<any>(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
  },

  async getUnreadCount() {
    return apiRequest<any>('/notifications/unread-count');
  },

  async markAsRead(notificationId: string) {
    return apiRequest<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  async markAllAsRead() {
    return apiRequest<any>('/notifications/read-all', {
      method: 'PUT',
    });
  },
};
