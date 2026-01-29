/**
 * Real API Client for Ozar Backend
 * Connects to NestJS backend at http://localhost:4000/api/v1
 */

const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://localhost:4000/api/v1';

// Token management - works for both web and React Native
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Storage adapter for cross-platform support
let storageAdapter: any = null;

// Initialize storage adapter
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  // Web environment
  storageAdapter = {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  };
} else {
  // React Native environment - try to load AsyncStorage
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    storageAdapter = AsyncStorage;
  } catch (e) {
    console.warn('[API Client] No storage available');
  }
}

export function setTokens(access: string, refresh: string) {
  console.log('[API Client] Setting tokens, access token length:', access?.length);
  accessToken = access;
  refreshToken = refresh;
  
  // Store in persistent storage if available
  if (storageAdapter) {
    try {
      storageAdapter.setItem('accessToken', access);
      storageAdapter.setItem('refreshToken', refresh);
      console.log('[API Client] Tokens saved to storage');
    } catch (e) {
      console.error('[API Client] Failed to save tokens:', e);
    }
  }
}

export function getAccessToken(): string | null {
  // Always return in-memory token if available
  if (accessToken) {
    return accessToken;
  }
  
  console.log('[API Client] No in-memory token, check storage');
  return null;
}

export function clearTokens() {
  console.log('[API Client] Clearing all tokens');
  accessToken = null;
  refreshToken = null;
  
  if (storageAdapter) {
    try {
      storageAdapter.removeItem('accessToken');
      storageAdapter.removeItem('refreshToken');
      console.log('[API Client] Tokens cleared from storage');
    } catch (e) {
      console.error('[API Client] Failed to clear tokens:', e);
    }
  }
}

// HTTP client with auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  console.log(`[API Client] Request to ${endpoint}`);
  console.log(`[API Client] Has token:`, !!token);
  console.log(`[API Client] Token value:`, token ? `${token.substring(0, 20)}...` : 'null');
  
  const headers: Record<string, string> = {};

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
  } else {
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
export const usersApi = {
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  }) {
    return apiRequest<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

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

  // Portfolio methods
  async getPortfolio(proId: string) {
    return apiRequest<any>(`/pros/${proId}/portfolio`);
  },

  async addPortfolioItem(proId: string, data: {
    imageUrl: string;
    title: string;
    description: string;
    category: string;
  }) {
    return apiRequest<any>(`/pros/${proId}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deletePortfolioItem(itemId: string) {
    return apiRequest<any>(`/pros/portfolio/${itemId}`, {
      method: 'DELETE',
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

  async createReview(bookingId: string, rating: number, comment: string, images?: string[]) {
    return apiRequest<any>(`/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment, images }),
    });
  },

  async cancelBooking(bookingId: string, reason: string) {
    return apiRequest<any>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async updateBookingNotes(bookingId: string, notes: string) {
    return apiRequest<any>(`/bookings/${bookingId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
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

  async toggleServiceStatus(serviceId: string) {
    return apiRequest<any>(`/services/${serviceId}/toggle-status`, {
      method: 'PUT',
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

  async getOrCreateConversation(data: {
    customerId: string;
    proId: string;
    bookingId?: string;
  }) {
    return apiRequest<any>('/chat/conversations/get-or-create', {
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

// Favorites API
export const favoritesApi = {
  async getFavorites() {
    return apiRequest<any>('/favorites');
  },

  async addFavorite(proId: string) {
    return apiRequest<any>(`/favorites/${proId}`, {
      method: 'POST',
    });
  },

  async removeFavorite(proId: string) {
    return apiRequest<any>(`/favorites/${proId}`, {
      method: 'DELETE',
    });
  },

  async isFavorite(proId: string) {
    return apiRequest<any>(`/favorites/check/${proId}`);
  },
};

// Reviews API
export const reviewsApi = {
  async getProReviews(proId: string, page = 1, limit = 10) {
    return apiRequest<any>(`/reviews/pro/${proId}?page=${page}&limit=${limit}`);
  },

  async getMyReviews() {
    return apiRequest<any>('/reviews/my-reviews');
  },

  async getReviewById(reviewId: string) {
    return apiRequest<any>(`/reviews/${reviewId}`);
  },

  async respondToReview(reviewId: string, responseText: string) {
    return apiRequest<any>(`/reviews/${reviewId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ responseText }),
    });
  },

  async flagReview(reviewId: string, reason: string) {
    return apiRequest<any>(`/reviews/${reviewId}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async toggleHelpfulVote(reviewId: string) {
    return apiRequest<any>(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  },

  async isReviewHelpful(reviewId: string) {
    return apiRequest<any>(`/reviews/${reviewId}/helpful/check`);
  },
};

// Analytics API
export const analyticsApi = {
  async getProDashboard(period: 'week' | 'month' | 'year' = 'month') {
    return apiRequest<any>(`/analytics/pro/dashboard?period=${period}`);
  },
};


// Availability API
export const availabilityApi = {
  getSchedule: () => apiRequest('/availability/schedule', { method: 'GET' }),
  updateSchedule: (schedules: any[]) => apiRequest('/availability/schedule', {
    method: 'PUT',
    body: JSON.stringify({ schedules }),
  }),
  getTimeOffs: () => apiRequest('/availability/time-off', { method: 'GET' }),
  addTimeOff: (data: any) => apiRequest('/availability/time-off', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteTimeOff: (id: string) => apiRequest(`/availability/time-off/${id}`, { method: 'DELETE' }),
};

// Certifications API
export const certificationsApi = {
  getCertifications: () => apiRequest('/certifications', { method: 'GET' }),
  addCertification: (data: any) => apiRequest('/certifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCertification: (id: string, data: any) => apiRequest(`/certifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCertification: (id: string) => apiRequest(`/certifications/${id}`, { method: 'DELETE' }),
  getBadges: () => apiRequest('/certifications/badges', { method: 'GET' }),
};

// Templates API
export const templatesApi = {
  getResponseTemplates: () => apiRequest('/templates/responses', { method: 'GET' }),
  createResponseTemplate: (data: any) => apiRequest('/templates/responses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateResponseTemplate: (id: string, data: any) => apiRequest(`/templates/responses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteResponseTemplate: (id: string) => apiRequest(`/templates/responses/${id}`, { method: 'DELETE' }),
  
  getQuickMessages: () => apiRequest('/templates/quick-messages', { method: 'GET' }),
  createQuickMessage: (data: any) => apiRequest('/templates/quick-messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateQuickMessage: (id: string, data: any) => apiRequest(`/templates/quick-messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteQuickMessage: (id: string) => apiRequest(`/templates/quick-messages/${id}`, { method: 'DELETE' }),
};

// Service Area API
export const serviceAreaApi = {
  getServiceAreas: () => apiRequest('/service-areas', { method: 'GET' }),
  addServiceArea: (data: any) => apiRequest('/service-areas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateServiceArea: (id: string, data: any) => apiRequest(`/service-areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteServiceArea: (id: string) => apiRequest(`/service-areas/${id}`, { method: 'DELETE' }),
  calculateTravelFee: (distance: number) => apiRequest(`/service-areas/calculate-travel-fee?distance=${distance}`, { method: 'GET' }),
};

// Booking Photos API
export const bookingPhotosApi = {
  uploadPhoto: (bookingId: string, data: any) => apiRequest(`/bookings/${bookingId}/photos`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getPhotos: (bookingId: string) => apiRequest(`/bookings/${bookingId}/photos`, { method: 'GET' }),
};

// Upload API
export const uploadApi = {
  async uploadImage(fileOrUri: File | Blob | string): Promise<string> {
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
      } as any);
    } else {
      // Handle web File/Blob
      formData.append('file', fileOrUri);
    }
    
    const result = await apiRequest<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser/RN set Content-Type with boundary
    });
    
    return result.url;
  },
  
  async uploadImages(filesOrUris: (File | Blob | string)[]): Promise<string[]> {
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
        } as any);
      } else {
        formData.append('files', fileOrUri);
      }
    });
    
    const result = await apiRequest<{ urls: string[] }>('/upload/images', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser/RN set Content-Type with boundary
    });
    
    return result.urls;
  },
};

// Jobs API (Job Posting & Bidding System)
export const jobsApi = {
  // Customer: Create a job posting
  async createJob(data: {
    title: string;
    description: string;
    category: string;
    urgency?: 'ASAP' | 'THIS_WEEK' | 'FLEXIBLE';
    locationAddr: string;
    locationCity: string;
    locationArea?: string;
    locationLat: number;
    locationLng: number;
    budgetMin?: number;
    budgetMax?: number;
    images?: string[];
    preferredDate?: string;
  }) {
    return apiRequest<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Customer: Get my job postings
  async getMyJobs(status?: string) {
    const params = status ? `?status=${status}` : '';
    return apiRequest<any>(`/jobs/my-jobs${params}`);
  },

  // Pro: Get available jobs to bid on
  async getAvailableJobs(filters?: {
    category?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    
    const query = params.toString();
    return apiRequest<any>(`/jobs/available${query ? `?${query}` : ''}`);
  },

  // Get single job details
  async getJobById(jobId: string) {
    return apiRequest<any>(`/jobs/${jobId}`);
  },

  // Get single job details (alias for compatibility)
  async getJob(jobId: string) {
    return apiRequest<any>(`/jobs/${jobId}`);
  },

  // Customer: Update a job
  async updateJob(jobId: string, data: {
    description?: string;
    urgency?: 'ASAP' | 'THIS_WEEK' | 'FLEXIBLE';
    budgetMin?: number;
    budgetMax?: number;
    images?: string[];
    preferredDate?: string;
  }) {
    return apiRequest<any>(`/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Customer: Cancel a job
  async cancelJob(jobId: string) {
    return apiRequest<any>(`/jobs/${jobId}/cancel`, {
      method: 'POST',
    });
  },

  // Pro: Submit a bid
  async createBid(data: {
    jobId: string;
    proposedPrice: number;
    estimatedDuration: number;
    message: string;
    availableFrom?: string;
  }) {
    return apiRequest<any>('/jobs/bids', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Pro: Get my bids
  async getMyBids(status?: string) {
    const params = status ? `?status=${status}` : '';
    return apiRequest<any>(`/jobs/bids/my-bids${params}`);
  },

  // Get single bid details
  async getBid(bidId: string) {
    return apiRequest<any>(`/jobs/bids/${bidId}`);
  },

  // Pro: Update a bid
  async updateBid(bidId: string, data: {
    proposedPrice?: number;
    estimatedDuration?: number;
    message?: string;
    availableFrom?: string;
  }) {
    return apiRequest<any>(`/jobs/bids/${bidId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Pro: Withdraw a bid
  async withdrawBid(bidId: string) {
    return apiRequest<any>(`/jobs/bids/${bidId}/withdraw`, {
      method: 'POST',
    });
  },

  // Customer: Accept a bid
  async acceptBid(bidId: string) {
    return apiRequest<any>(`/jobs/bids/${bidId}/accept`, {
      method: 'POST',
    });
  },

  // Customer: Reject a bid
  async rejectBid(bidId: string) {
    return apiRequest<any>(`/jobs/bids/${bidId}/reject`, {
      method: 'POST',
    });
  },
};
