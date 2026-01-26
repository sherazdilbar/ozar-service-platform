"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPros = getPros;
exports.getProById = getProById;
exports.getReviews = getReviews;
exports.createBooking = createBooking;
exports.getBookings = getBookings;
exports.getBookingById = getBookingById;
exports.authorizePayment = authorizePayment;
exports.cancelBooking = cancelBooking;
exports.getConversations = getConversations;
exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
exports.getProDashboard = getProDashboard;
exports.respondToBooking = respondToBooking;
exports.updateAvailability = updateAvailability;
exports.getAvailability = getAvailability;
exports.submitReview = submitReview;
const apiClient_1 = require("./apiClient");
async function getPros(filters) {
    try {
        const result = await apiClient_1.prosApi.getPros({
            category: filters?.category,
            city: filters?.city,
            lat: filters?.location?.lat,
            lng: filters?.location?.lng,
            radiusKm: filters?.maxDistance,
            availableNow: filters?.availableNow,
            minRating: filters?.minRating,
            searchTerm: filters?.searchTerm,
        });
        return result.data.map((pro) => ({
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
    }
    catch (error) {
        console.error('Failed to fetch pros from API:', error);
        return [];
    }
}
async function getProById(proId) {
    try {
        return await apiClient_1.prosApi.getProById(proId);
    }
    catch (error) {
        console.error('Failed to fetch pro:', error);
        return null;
    }
}
async function getReviews(proId) {
    try {
        const result = await apiClient_1.prosApi.getProReviews(proId);
        return result.data || [];
    }
    catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
}
async function createBooking(payload) {
    try {
        const result = await apiClient_1.bookingsApi.createBooking({
            proId: payload.proId,
            serviceId: payload.serviceId,
            scheduledFor: payload.scheduledFor,
            isASAP: payload.isASAP,
            description: payload.description,
            images: payload.images,
            location: payload.location,
        });
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
    catch (error) {
        console.error('Failed to create booking via API:', error);
        throw error;
    }
}
async function getBookings(userId, role = 'customer') {
    try {
        const result = await apiClient_1.bookingsApi.getBookings();
        return result.data.map((booking) => ({
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
    }
    catch (error) {
        console.error('Failed to fetch bookings:', error);
        return [];
    }
}
async function getBookingById(bookingId) {
    try {
        const booking = await apiClient_1.bookingsApi.getBookingById(bookingId);
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
    }
    catch (error) {
        console.error('Failed to fetch booking:', error);
        return null;
    }
}
async function authorizePayment(bookingId) {
    return {
        id: `pi_${Date.now()}`,
        bookingId,
        amount: 0,
        currency: 'HUF',
        status: 'AUTHORIZED',
        createdAt: new Date().toISOString()
    };
}
async function cancelBooking(bookingId, reason, cancelledBy) {
    throw new Error('Not implemented');
}
async function getConversations(userId) {
    return [];
}
async function getMessages(conversationId) {
    return [];
}
async function sendMessage(conversationId, senderId, text, imageUrl) {
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
async function getProDashboard(proId) {
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
async function respondToBooking(bookingId, action, counterOffer) {
    try {
        if (action === 'accept') {
            const result = await apiClient_1.bookingsApi.acceptBooking(bookingId);
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
        else {
            const result = await apiClient_1.bookingsApi.declineBooking(bookingId, 'Not available at this time');
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
    }
    catch (error) {
        console.error('Failed to respond to booking:', error);
        throw error;
    }
}
async function updateAvailability(proId, slots) {
    return slots;
}
async function getAvailability(proId) {
    return [];
}
async function submitReview(bookingId, proId, customerId, rating, comment) {
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
//# sourceMappingURL=api.js.map