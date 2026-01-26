import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { BookingStateMachineService } from './booking-state-machine.service';
import { AvailabilityService } from './availability.service';
import { NotificationsEnhancedService } from '../notifications/notifications-enhanced.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private stateMachine: BookingStateMachineService,
    private availability: AvailabilityService,
    private notificationsService: NotificationsEnhancedService,
  ) {}

  async create(customerId: string, dto: CreateBookingDto) {
    // Verify the user is a customer (not a pro)
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('User not found');
    }

    if (customer.role !== 'CUSTOMER') {
      throw new BadRequestException('Only customers can book services');
    }

    // Verify service exists
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
      include: { pro: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Prevent pros from booking themselves
    if (dto.proId === customerId) {
      throw new BadRequestException('You cannot book yourself');
    }

    // Check availability if scheduled time is provided
    if (dto.scheduledFor) {
      const scheduledDate = new Date(dto.scheduledFor);
      await this.availability.checkAvailability(
        dto.proId,
        scheduledDate,
        service.duration,
      );
    }

    // Calculate pricing
    const platformFee = Math.round(service.price * 0.15);
    const total = service.price + platformFee;

    // Create booking
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

    // Lock the time slot if scheduled
    if (dto.scheduledFor) {
      await this.availability.lockTimeSlot(
        dto.proId,
        new Date(dto.scheduledFor),
        service.duration,
        booking.id,
      );
    }

    // Create booking event (audit log)
    await this.prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        status: 'REQUESTED',
        note: 'Booking created',
      },
    });

    // Send booking confirmation email to customer (async)
    this.notificationsService.notifyBookingConfirmation(
      customerId,
      booking.id,
      {
        serviceName: service.name,
        proName: service.pro.businessName || 'Professional',
        date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
        time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
        location: booking.locationAddr,
        price: booking.total,
        currency: booking.currency,
        bookingId: booking.id,
      },
    ).catch(err => {
      console.error('Failed to send booking confirmation email:', err);
    });

    // Notify PRO about new booking request
    this.notificationsService.notifyBookingRequest(
      service.pro.userId,
      booking.id,
      `${customer.firstName} ${customer.lastName}`,
      {
        serviceName: service.name,
        customerName: `${customer.firstName} ${customer.lastName}`,
        date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
        time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
        location: booking.locationAddr,
        price: booking.total,
        currency: booking.currency,
        bookingId: booking.id,
      },
    ).catch(err => {
      console.error('Failed to send booking request notification:', err);
    });

    return booking;
  }

  async findAll(userId: string, userRole: string, status?: string, page = 1, limit = 10) {
    const where: any = {};

    if (userRole === 'CUSTOMER') {
      where.customerId = userId;
    } else if (userRole === 'PRO') {
      // Find pro profile
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

  async findOne(id: string, userId: string, userRole: string) {
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
      throw new NotFoundException('Booking not found');
    }

    // Verify access
    if (userRole === 'CUSTOMER' && booking.customerId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (userRole === 'PRO') {
      const proProfile = await this.prisma.proProfile.findUnique({
        where: { userId },
      });
      if (!proProfile || booking.proId !== proProfile.id) {
        throw new NotFoundException('Booking not found');
      }
    }

    return booking;
  }

  async updateStatus(id: string, userId: string, userRole: string, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id, userId, userRole);

    // Validate status transition using state machine
    this.stateMachine.validateTransition(
      booking.status as BookingStatus,
      dto.status as BookingStatus,
      dto.reason,
    );

    // Check if user has permission for this transition
    const canTransition = this.stateMachine.canUserTransition(
      userRole,
      booking.status as BookingStatus,
      dto.status as BookingStatus,
    );

    if (!canTransition) {
      throw new BadRequestException(
        `User with role ${userRole} cannot perform this transition`,
      );
    }

    // Update booking
    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: dto.status as BookingStatus,
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

    // Create event (audit log)
    await this.prisma.bookingEvent.create({
      data: {
        bookingId: id,
        status: dto.status as BookingStatus,
        note: dto.reason || this.stateMachine.getStatusLabel(dto.status as BookingStatus),
      },
    });

    return updated;
  }

  async accept(id: string, userId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!proProfile) {
      throw new BadRequestException('Pro profile not found');
    }

    const booking = await this.findOne(id, userId, 'PRO');

    // Validate transition
    this.stateMachine.validateTransition(
      booking.status as BookingStatus,
      'ACCEPTED' as BookingStatus,
    );

    const updated = await this.updateStatus(id, userId, 'PRO', {
      status: 'ACCEPTED',
    });

    // Send notification + email to customer
    await this.notificationsService.notifyBookingAccepted(
      booking.customerId,
      id,
      `${proProfile.user.firstName} ${proProfile.user.lastName}`,
      {
        serviceName: booking.service.name,
        proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
        date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
        time: booking.scheduledFor ? booking.scheduledFor.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible',
        location: booking.locationAddr,
        price: booking.total,
        currency: booking.currency,
        bookingId: booking.id,
      },
    );

    return updated;
  }

  async decline(id: string, userId: string, reason: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!proProfile) {
      throw new BadRequestException('Pro profile not found');
    }

    const booking = await this.findOne(id, userId, 'PRO');

    // Validate transition
    this.stateMachine.validateTransition(
      booking.status as BookingStatus,
      'CANCELLED_BY_PRO' as BookingStatus,
      reason,
    );

    const updated = await this.updateStatus(id, userId, 'PRO', {
      status: 'CANCELLED_BY_PRO',
      reason,
    });

    // Send notification + email to customer
    await this.notificationsService.notifyBookingCancelled(
      booking.customerId,
      id,
      `${proProfile.user.firstName} ${proProfile.user.lastName}`,
      {
        serviceName: booking.service.name,
        proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
        reason: reason,
        bookingId: booking.id,
      },
    );

    return updated;
  }

  /**
   * Get available time slots for a pro on a given date
   */
  async getAvailableSlots(proId: string, date: string, serviceId: string) {
    // Get service to know duration
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const targetDate = new Date(date);
    const slots = await this.availability.getAvailableSlots(
      proId,
      targetDate,
      service.duration,
    );

    return {
      date: targetDate,
      duration: service.duration,
      slots: slots.map(slot => ({
        time: slot.toISOString(),
        available: true,
      })),
    };
  }

  /**
   * Pro marks job as in progress
   */
  async startJob(id: string, userId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!proProfile) {
      throw new BadRequestException('Pro profile not found');
    }

    const booking = await this.findOne(id, userId, 'PRO');

    // Validate transition
    this.stateMachine.validateTransition(
      booking.status as BookingStatus,
      'IN_PROGRESS' as BookingStatus,
    );

    const updated = await this.updateStatus(id, userId, 'PRO', {
      status: 'IN_PROGRESS',
    });

    // Send notification to customer
    await this.notificationsService.create(
      booking.customerId,
      'BOOKING_REQUEST' as any,
      'Job Started',
      `Your service has started`,
      { bookingId: id },
    );

    return updated;
  }

  /**
   * Pro marks job as completed
   */
  async completeJob(id: string, userId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!proProfile) {
      throw new BadRequestException('Pro profile not found');
    }

    const booking = await this.findOne(id, userId, 'PRO');

    // Validate transition
    this.stateMachine.validateTransition(
      booking.status as BookingStatus,
      'COMPLETED' as BookingStatus,
    );

    const updated = await this.updateStatus(id, userId, 'PRO', {
      status: 'COMPLETED',
    });

    // Increment pro's jobs completed count
    await this.prisma.proProfile.update({
      where: { id: proProfile.id },
      data: {
        jobsCompleted: {
          increment: 1,
        },
      },
    });

    // Send notification + email to customer
    await this.notificationsService.notifyBookingCompleted(
      booking.customerId,
      id,
      `${proProfile.user.firstName} ${proProfile.user.lastName}`,
      {
        serviceName: booking.service.name,
        proName: proProfile.businessName || `${proProfile.user.firstName} ${proProfile.user.lastName}`,
        date: booking.scheduledFor ? booking.scheduledFor.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ASAP',
        price: booking.total,
        currency: booking.currency,
        bookingId: booking.id,
      },
    );

    return updated;
  }

  /**
   * Create a review for a completed booking
   */
  async createReview(
    bookingId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    // Get booking and verify it's completed
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
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new BadRequestException('Only the customer can review this booking');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed bookings');
    }

    if (booking.review) {
      throw new BadRequestException('Booking already has a review');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId,
        proId: booking.proId,
        customerId: userId,
        rating,
        comment,
      },
    });

    // Update pro's rating
    const reviews = await this.prisma.review.findMany({
      where: { proId: booking.proId },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.proProfile.update({
      where: { id: booking.proId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
      },
    });

    // Send notification to pro
    if (booking.pro?.user) {
      await this.notificationsService.create(
        booking.pro.user.id,
        'REVIEW_RECEIVED' as any,
        'New Review',
        `You received a ${rating}-star review`,
        { bookingId, reviewId: review.id },
      );
    }

    return review;
  }
}
