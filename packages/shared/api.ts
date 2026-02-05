import {
  ProProfile,
  Booking,
  Review,
  Conversation,
  Message,
  ProDashboard,
  ProFilters,
  BookingStatus,
  AvailabilitySlot,
  PaymentIntent,
  AvailabilityStatus
} from './types';
import { prosApi, bookingsApi, categoriesApi } from './apiClient';

// Pro Discovery & Search
export async function getPros(filters?: ProFilters): Promise<ProProfile[]> {
  try {
    const result = await prosApi.getPros({
      category: filters?.category,
      city: filters?.city,
      district: filters?.district,
      lat: filters?.location?.lat,
      lng: filters?.location?.lng,
      radiusKm: filters?.maxDistance,
      availableNow: filters?.availableNow,
      minRating: filters?.minRating,
      searchTerm: filters?.searchTerm,
    });
    
    // Transform backend response to frontend format
    return result.data.map((pro: any) => ({
      id: pro.id,
      userId: pro.userId,
      businessName: pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`,
      user: {
        firstName: pro.user.firstName,
        lastName: pro.user.lastName,
        avatar: pro.user.avatar || null,
      },
      categories: pro.categories,
      rating: pro.rating,
      reviewCount: pro.reviewCount,
      jobsCompleted: pro.jobsCompleted,
      yearsExperience: pro.yearsExperience,
      verificationStatus: pro.verificationStatus,
      availabilityStatus: pro.availabilityStatus,
      startingPrice: pro.startingPrice,
      currency: pro.currency,
      responseTime: pro.responseTime,
      location: {
        city: pro.locationCity,
        area: pro.locationArea,
        lat: pro.locationLat,
        lng: pro.locationLng,
      },
      serviceArea: {
        city: pro.serviceAreaCity,
        radiusKm: pro.serviceAreaRadius,
      },
      bio: pro.bio,
      services: pro.services || [],
      portfolio: pro.portfolio || [],
    }));
  } catch (error) {
    console.error('Failed to fetch pros from API:', error);
    return [];
  }
}

export async function getProById(proId: string): Promise<ProProfile | null> {
  try {
    return await prosApi.getProById(proId);
  } catch (error) {
    console.error('Failed to fetch pro:', error);
    return null;
  }
}

export async function getReviews(proId: string): Promise<Review[]> {
  try {
    const result = await prosApi.getProReviews(proId);
    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

// Booking Management
export async function createBooking(payload: {
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
}): Promise<Booking> {
  try {
    const result = await bookingsApi.createBooking({
      proId: payload.proId,
      serviceId: payload.serviceId,
      scheduledFor: payload.scheduledFor,
      isASAP: payload.isASAP,
      description: payload.description,
      images: payload.images,
      location: payload.location,
    });
    
    // Transform to frontend format
    return {
      id: result.id,
      customerId: result.customerId,
      proId: result.proId,
      serviceId: result.serviceId,
      status: result.status,
      service: result.service,
      pro: result.pro,
      customer: result.customer,
      scheduledFor: result.scheduledFor,
      isASAP: result.isASAP,
      description: result.description,
      images: result.images,
      location: {
        address: result.locationAddr,
        city: result.locationCity,
        lat: result.locationLat,
        lng: result.locationLng,
      },
      pricing: {
        servicePrice: result.servicePrice,
        platformFee: result.platformFee,
        total: result.total,
        currency: result.currency,
      },
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  } catch (error) {
    console.error('Failed to create booking via API:', error);
    throw error;
  }
}

export async function getBookings(userId: string, role: 'customer' | 'pro' = 'customer'): Promise<Booking[]> {
  try {
    const result = await bookingsApi.getBookings();
    return result.data.map((booking: any) => ({
      id: booking.id,
      customerId: booking.customerId,
      proId: booking.proId,
      serviceId: booking.serviceId,
      status: booking.status,
      service: booking.service,
      pro: booking.pro,
      customer: booking.customer,
      scheduledFor: booking.scheduledFor,
      isASAP: booking.isASAP,
      description: booking.description,
      images: booking.images,
      location: {
        address: booking.locationAddr,
        city: booking.locationCity,
        lat: booking.locationLat,
        lng: booking.locationLng,
      },
      pricing: {
        servicePrice: booking.servicePrice,
        platformFee: booking.platformFee,
        total: booking.total,
        currency: booking.currency,
      },
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      completedAt: booking.completedAt,
    }));
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const booking = await bookingsApi.getBookingById(bookingId);
    return {
      id: booking.id,
      customerId: booking.customerId,
      proId: booking.proId,
      serviceId: booking.serviceId,
      status: booking.status,
      service: booking.service,
      pro: booking.pro,
      customer: booking.customer,
      scheduledFor: booking.scheduledFor,
      isASAP: booking.isASAP,
      description: booking.description,
      images: booking.images,
      location: {
        address: booking.locationAddr,
        city: booking.locationCity,
        lat: booking.locationLat,
        lng: booking.locationLng,
      },
      pricing: {
        servicePrice: booking.servicePrice,
        platformFee: booking.platformFee,
        total: booking.total,
        currency: booking.currency,
      },
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      completedAt: booking.completedAt,
      events: booking.events,
    };
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

export async function authorizePayment(bookingId: string): Promise<PaymentIntent> {
  // TODO: Implement real payment authorization
  return {
    id: `pi_${Date.now()}`,
    bookingId,
    amount: 0,
    currency: 'HUF',
    status: 'AUTHORIZED',
    createdAt: new Date().toISOString()
  };
}

export async function cancelBooking(bookingId: string, reason: string, cancelledBy: 'customer' | 'pro'): Promise<Booking> {
  // TODO: Implement real cancellation
  throw new Error('Not implemented');
}

// Messaging
export async function getConversations(userId: string): Promise<Conversation[]> {
  // TODO: Implement real conversations API
  return [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  // TODO: Implement real messages API
  return [];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
  imageUrl?: string
): Promise<Message> {
  // TODO: Implement real send message API
  return {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId,
    text,
    imageUrl,
    createdAt: new Date().toISOString(),
    read: false
  };
}

// Pro Dashboard
export async function getProDashboard(proId: string): Promise<ProDashboard> {
  // TODO: Implement real dashboard API
  return {
    proId,
    todaySchedule: [],
    pendingRequests: [],
    earnings: {
      today: 0,
      week: 0,
      month: 0,
      currency: 'HUF'
    },
    stats: {
      activeBookings: 0,
      completedToday: 0,
      rating: 0,
      responseRate: 0
    }
  };
}

export async function respondToBooking(
  bookingId: string,
  action: 'accept' | 'decline',
  counterOffer?: {
    price: number;
    scheduledFor?: string;
  }
): Promise<Booking> {
  try {
    if (action === 'accept') {
      const result = await bookingsApi.acceptBooking(bookingId);
      return {
        id: result.id,
        customerId: result.customerId,
        proId: result.proId,
        serviceId: result.serviceId,
        status: result.status,
        service: result.service,
        pro: result.pro,
        customer: result.customer,
        scheduledFor: result.scheduledFor,
        isASAP: result.isASAP,
        description: result.description,
        images: result.images,
        location: {
          address: result.locationAddr,
          city: result.locationCity,
          lat: result.locationLat,
          lng: result.locationLng,
        },
        pricing: {
          servicePrice: result.servicePrice,
          platformFee: result.platformFee,
          total: result.total,
          currency: result.currency,
        },
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    } else {
      const result = await bookingsApi.declineBooking(bookingId, 'Not available at this time');
      return {
        id: result.id,
        customerId: result.customerId,
        proId: result.proId,
        serviceId: result.serviceId,
        status: result.status,
        service: result.service,
        pro: result.pro,
        customer: result.customer,
        scheduledFor: result.scheduledFor,
        isASAP: result.isASAP,
        description: result.description,
        images: result.images,
        location: {
          address: result.locationAddr,
          city: result.locationCity,
          lat: result.locationLat,
          lng: result.locationLng,
        },
        pricing: {
          servicePrice: result.servicePrice,
          platformFee: result.platformFee,
          total: result.total,
          currency: result.currency,
        },
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    }
  } catch (error) {
    console.error('Failed to respond to booking:', error);
    throw error;
  }
}

export async function updateAvailability(
  proId: string,
  slots: AvailabilitySlot[]
): Promise<AvailabilitySlot[]> {
  // TODO: Implement real availability update
  return slots;
}

export async function getAvailability(proId: string): Promise<AvailabilitySlot[]> {
  // TODO: Implement real availability fetch
  return [];
}

// Reviews
export async function submitReview(
  bookingId: string,
  proId: string,
  customerId: string,
  rating: number,
  comment: string
): Promise<Review> {
  // TODO: Implement real review submission
  return {
    id: `rev_${Date.now()}`,
    bookingId,
    proId,
    customerId,
    customerName: 'Customer',
    customerAvatar: undefined,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };
}
