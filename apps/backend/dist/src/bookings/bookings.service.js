"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_state_machine_service_1 = require("./booking-state-machine.service");
const availability_service_1 = require("./availability.service");
const notifications_enhanced_service_1 = require("../notifications/notifications-enhanced.service");
let BookingsService = class BookingsService {
    constructor(prisma, stateMachine, availability, notificationsService) {
        this.prisma = prisma;
        this.stateMachine = stateMachine;
        this.availability = availability;
        this.notificationsService = notificationsService;
    }
    async create(customerId, dto) {
        const customer = await this.prisma.user.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('User not found');
        }
        if (customer.role !== 'CUSTOMER') {
            throw new common_1.BadRequestException('Only customers can book services');
        }
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
            include: { pro: true },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (dto.proId === customerId) {
            throw new common_1.BadRequestException('You cannot book yourself');
        }
        if (dto.scheduledFor) {
            const scheduledDate = new Date(dto.scheduledFor);
            await this.availability.checkAvailability(dto.proId, scheduledDate, service.duration);
        }
        const platformFee = Math.round(service.price * 0.15);
        const total = service.price + platformFee;
        const booking = await this.prisma.booking.create({
            data: {
                customerId,
                proId: dto.proId,
                serviceId: dto.serviceId,
                scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
                isASAP: dto.isASAP,
                description: dto.description,
                images: dto.images || [],
                locationAddr: dto.location.address,
                locationCity: dto.location.city,
                locationLat: dto.location.lat,
                locationLng: dto.location.lng,
                servicePrice: service.price,
                platformFee,
                total,
                currency: service.currency,
                status: 'REQUESTED',
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                avatar: true,
                            },
                        },
                    },
                },
                service: true,
            },
        });
        if (dto.scheduledFor) {
            await this.availability.lockTimeSlot(dto.proId, new Date(dto.scheduledFor), service.duration, booking.id);
        }
        await this.prisma.bookingEvent.create({
            data: {
                bookingId: booking.id,
                status: 'REQUESTED',
                note: 'Booking created',
            },
        });
        this.notificationsService.notifyBookingConfirmation(customerId, booking.id, {
            serviceName: service.name,
            proName: service.pro.businessName || 'Professional',
            date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
            time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
            location: booking.locationAddr,
            price: booking.total,
            currency: booking.currency,
            bookingId: booking.id,
        }).catch(err => {
            console.error('Failed to send booking confirmation email:', err);
        });
        this.notificationsService.notifyBookingRequest(service.pro.userId, booking.id, `${customer.firstName} ${customer.lastName}`, {
            serviceName: service.name,
            customerName: `${customer.firstName} ${customer.lastName}`,
            date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
            time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
            location: booking.locationAddr,
            price: booking.total,
            currency: booking.currency,
            bookingId: booking.id,
        }).catch(err => {
            console.error('Failed to send booking request notification:', err);
        });
        return booking;
    }
    async findAll(userId, userRole, status, page = 1, limit = 10) {
        const where = {};
        if (userRole === 'CUSTOMER') {
            where.customerId = userId;
        }
        else if (userRole === 'PRO') {
            const proProfile = await this.prisma.proProfile.findUnique({
                where: { userId },
            });
            if (proProfile) {
                where.proId = proProfile.id;
            }
        }
        if (status) {
            where.status = status;
        }
        const bookings = await this.prisma.booking.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                avatar: true,
                            },
                        },
                    },
                },
                service: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.booking.count({ where });
        return {
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                avatar: true,
                            },
                        },
                    },
                },
                service: true,
                events: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userRole === 'CUSTOMER' && booking.customerId !== userId) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userRole === 'PRO') {
            const proProfile = await this.prisma.proProfile.findUnique({
                where: { userId },
            });
            if (!proProfile || booking.proId !== proProfile.id) {
                throw new common_1.NotFoundException('Booking not found');
            }
        }
        return booking;
    }
    async updateStatus(id, userId, userRole, dto) {
        const booking = await this.findOne(id, userId, userRole);
        this.stateMachine.validateTransition(booking.status, dto.status, dto.reason);
        const canTransition = this.stateMachine.canUserTransition(userRole, booking.status, dto.status);
        if (!canTransition) {
            throw new common_1.BadRequestException(`User with role ${userRole} cannot perform this transition`);
        }
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.status === 'COMPLETED' && { completedAt: new Date() }),
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                avatar: true,
                            },
                        },
                    },
                },
                service: true,
            },
        });
        await this.prisma.bookingEvent.create({
            data: {
                bookingId: id,
                status: dto.status,
                note: dto.reason || this.stateMachine.getStatusLabel(dto.status),
            },
        });
        return updated;
    }
    async accept(id, userId) {
        const proProfile = await this.prisma.proProfile.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!proProfile) {
            throw new common_1.BadRequestException('Pro profile not found');
        }
        const booking = await this.findOne(id, userId, 'PRO');
        this.stateMachine.validateTransition(booking.status, 'ACCEPTED');
        const updated = await this.updateStatus(id, userId, 'PRO', {
            status: 'ACCEPTED',
        });
        await this.notificationsService.notifyBookingAccepted(booking.customerId, id, `${proProfile.user.firstName} ${proProfile.user.lastName}`, {
            serviceName: booking.service.name,
            proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
            date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
            time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
            location: booking.locationAddr,
            price: booking.total,
            currency: booking.currency,
            bookingId: booking.id,
        });
        return updated;
    }
    async decline(id, userId, reason) {
        const proProfile = await this.prisma.proProfile.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!proProfile) {
            throw new common_1.BadRequestException('Pro profile not found');
        }
        const booking = await this.findOne(id, userId, 'PRO');
        this.stateMachine.validateTransition(booking.status, 'CANCELLED_BY_PRO', reason);
        const updated = await this.updateStatus(id, userId, 'PRO', {
            status: 'CANCELLED_BY_PRO',
            reason,
        });
        await this.notificationsService.notifyBookingCancelled(booking.customerId, id, `${proProfile.user.firstName} ${proProfile.user.lastName}`, {
            serviceName: booking.service.name,
            proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
            reason: reason,
            bookingId: booking.id,
        });
        return updated;
    }
    async cancelByCustomer(id, userId, reason) {
        const booking = await this.findOne(id, userId, 'CUSTOMER');
        this.stateMachine.validateTransition(booking.status, 'CANCELLED_BY_CUSTOMER', reason);
        const updated = await this.updateStatus(id, userId, 'CUSTOMER', {
            status: 'CANCELLED_BY_CUSTOMER',
            reason,
        });
        await this.notificationsService.notifyBookingCancelled(booking.pro.userId, id, `${booking.customer.firstName} ${booking.customer.lastName}`, {
            serviceName: booking.service.name,
            customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
            reason: reason,
            bookingId: booking.id,
        });
        return updated;
    }
    async updateCustomerNotes(id, userId, notes) {
        const booking = await this.findOne(id, userId, 'CUSTOMER');
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                customerNotes: notes,
            },
        });
        return updated;
    }
    async getAvailableSlots(proId, date, serviceId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        const targetDate = new Date(date);
        const slots = await this.availability.getAvailableSlots(proId, targetDate, service.duration);
        return {
            date: targetDate,
            duration: service.duration,
            slots: slots.map(slot => ({
                time: slot.toISOString(),
                available: true,
            })),
        };
    }
    async startJob(id, userId) {
        const proProfile = await this.prisma.proProfile.findUnique({
            where: { userId },
        });
        if (!proProfile) {
            throw new common_1.BadRequestException('Pro profile not found');
        }
        const booking = await this.findOne(id, userId, 'PRO');
        this.stateMachine.validateTransition(booking.status, 'IN_PROGRESS');
        const updated = await this.updateStatus(id, userId, 'PRO', {
            status: 'IN_PROGRESS',
        });
        await this.notificationsService.create(booking.customerId, 'BOOKING_REQUEST', 'Job Started', `Your service has started`, { bookingId: id });
        return updated;
    }
    async completeJob(id, userId) {
        const proProfile = await this.prisma.proProfile.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!proProfile) {
            throw new common_1.BadRequestException('Pro profile not found');
        }
        const booking = await this.findOne(id, userId, 'PRO');
        this.stateMachine.validateTransition(booking.status, 'COMPLETED');
        const updated = await this.updateStatus(id, userId, 'PRO', {
            status: 'COMPLETED',
        });
        await this.prisma.proProfile.update({
            where: { id: proProfile.id },
            data: {
                jobsCompleted: {
                    increment: 1,
                },
            },
        });
        await this.notificationsService.notifyBookingCompleted(booking.customerId, id, `${proProfile.user.firstName} ${proProfile.user.lastName}`, {
            serviceName: booking.service.name,
            proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
            date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
            price: booking.total,
            currency: booking.currency,
            bookingId: booking.id,
        });
        return updated;
    }
    async createReview(bookingId, userId, rating, comment, images) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                review: true,
                pro: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId) {
            throw new common_1.BadRequestException('Only the customer can review this booking');
        }
        if (booking.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only review completed bookings');
        }
        if (booking.review) {
            throw new common_1.BadRequestException('Booking already has a review');
        }
        if (rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const review = await this.prisma.review.create({
            data: {
                bookingId,
                proId: booking.proId,
                customerId: userId,
                rating,
                comment,
                images: images || [],
            },
        });
        const reviews = await this.prisma.review.findMany({
            where: { proId: booking.proId },
        });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await this.prisma.proProfile.update({
            where: { id: booking.proId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: reviews.length,
            },
        });
        if (booking.pro?.user) {
            await this.notificationsService.create(booking.pro.user.id, 'REVIEW_RECEIVED', 'New Review', `You received a ${rating}-star review`, { bookingId, reviewId: review.id });
        }
        return review;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_state_machine_service_1.BookingStateMachineService,
        availability_service_1.AvailabilityService,
        notifications_enhanced_service_1.NotificationsEnhancedService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map