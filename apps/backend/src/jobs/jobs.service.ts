import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsEnhancedService, NotificationType } from '../notifications/notifications-enhanced.service';
import { CreateJobDto, UpdateJobDto, CreateBidDto, UpdateBidDto } from './dto';
import { JobStatus, BidStatus, ServiceCategory } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsEnhancedService,
  ) {}

  // ==================== JOB METHODS ====================

  async createJob(customerId: string, dto: CreateJobDto) {
    // Validate budget range
    if (dto.budgetMin && dto.budgetMax && dto.budgetMin >= dto.budgetMax) {
      throw new BadRequestException('budgetMin must be less than budgetMax');
    }

    // Validate images count
    if (dto.images && dto.images.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed');
    }

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const job = await this.prisma.job.create({
      data: {
        customerId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        urgency: dto.urgency,
        locationAddr: dto.locationAddr,
        locationCity: dto.locationCity,
        locationArea: dto.locationArea,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        images: dto.images || [],
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
        expiresAt,
        status: JobStatus.OPEN,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Notify matching professionals
    await this.notifyMatchingProfessionals(job);

    return job;
  }

  async findCustomerJobs(customerId: string, status?: JobStatus) {
    const where: any = { customerId };
    if (status) {
      where.status = status;
    }

    return this.prisma.job.findMany({
      where,
      include: {
        _count: {
          select: { bids: true },
        },
        bids: {
          where: { status: BidStatus.PENDING },
          take: 3,
          orderBy: { proposedPrice: 'asc' },
          include: {
            pro: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findJobById(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
        bids: {
          include: {
            pro: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { proposedPrice: 'asc' },
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check authorization
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { proProfile: true },
    });

    const isCustomer = job.customerId === userId;
    const hasBid = user?.proProfile && job.bids.some(bid => bid.proId === user.proProfile.id);
    const canViewAsProspectiveBidder = user?.proProfile && job.status === JobStatus.OPEN;

    if (!isCustomer && !hasBid && !canViewAsProspectiveBidder) {
      throw new ForbiddenException('You do not have access to this job');
    }

    return job;
  }

  async updateJob(jobId: string, customerId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.customerId !== customerId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Can only update OPEN jobs');
    }

    // Validate budget range if both provided
    if (dto.budgetMin && dto.budgetMax && dto.budgetMin >= dto.budgetMax) {
      throw new BadRequestException('budgetMin must be less than budgetMax');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        description: dto.description,
        urgency: dto.urgency,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        images: dto.images,
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined,
      },
    });
  }

  async cancelJob(jobId: string, customerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        bids: {
          where: { status: BidStatus.PENDING },
          include: {
            pro: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.customerId !== customerId) {
      throw new ForbiddenException('You can only cancel your own jobs');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Can only cancel OPEN jobs');
    }

    // Update job status
    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.CANCELLED },
    });

    // Notify all professionals with pending bids
    for (const bid of job.bids) {
      await this.notificationsService.create(
        bid.pro.userId,
        NotificationType.BOOKING_CANCELLED,
        'Job Cancelled',
        `The job "${job.title}" has been cancelled by the customer`,
        { jobId: job.id, bidId: bid.id },
      );
    }

    return updatedJob;
  }

  async findAvailableJobs(proId: string, category?: ServiceCategory) {
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: proId },
    });

    if (!pro) {
      throw new NotFoundException('Professional profile not found');
    }

    // Build where clause
    const where: any = {
      status: JobStatus.OPEN,
      expiresAt: { gt: new Date() },
      category: category ? category : { in: pro.categories },
      bids: {
        none: {
          proId: proId,
        },
      },
    };

    // Get jobs
    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by service area (distance calculation)
    const filteredJobs = jobs.filter(job => {
      const distance = this.calculateDistance(
        pro.locationLat,
        pro.locationLng,
        job.locationLat,
        job.locationLng,
      );
      return distance <= pro.serviceAreaRadius;
    }).filter(job => {
      // Exclude jobs with 10 or more bids
      return job._count.bids < 10;
    });

    return filteredJobs;
  }

  // ==================== BID METHODS ====================

  async createBid(proId: string, dto: CreateBidDto) {
    // Check if job exists and is open
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
      include: {
        _count: {
          select: { bids: true },
        },
        customer: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Job is not open for bidding');
    }

    if (job._count.bids >= 10) {
      throw new ConflictException('Job already has maximum number of bids');
    }

    // Check if pro already bid
    const existingBid = await this.prisma.bid.findUnique({
      where: {
        jobId_proId: {
          jobId: dto.jobId,
          proId: proId,
        },
      },
    });

    if (existingBid) {
      throw new ConflictException('You have already submitted a bid for this job');
    }

    // Check if pro's category matches job category
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: proId },
      include: { user: true },
    });

    if (!pro) {
      throw new NotFoundException('Professional profile not found');
    }

    if (!pro.categories.includes(job.category)) {
      throw new BadRequestException('Job category does not match your service categories');
    }

    // Check if job is in pro's service area
    const distance = this.calculateDistance(
      pro.locationLat,
      pro.locationLng,
      job.locationLat,
      job.locationLng,
    );

    if (distance > pro.serviceAreaRadius) {
      throw new BadRequestException('Job is outside your service area');
    }

    // Create bid
    const bid = await this.prisma.bid.create({
      data: {
        jobId: dto.jobId,
        proId: proId,
        proposedPrice: dto.proposedPrice,
        estimatedDuration: dto.estimatedDuration,
        message: dto.message,
        availableFrom: dto.availableFrom ? new Date(dto.availableFrom) : null,
        status: BidStatus.PENDING,
      },
      include: {
        pro: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        job: true,
      },
    });

    // Notify customer
    await this.notificationsService.create(
      job.customerId,
      NotificationType.BOOKING_REQUEST,
      'New Bid Received',
      `${pro.user.firstName} ${pro.user.lastName} submitted a bid for "${job.title}"`,
      { jobId: job.id, bidId: bid.id },
    );

    return bid;
  }

  async findProBids(proId: string, status?: BidStatus) {
    const where: any = { proId };
    if (status) {
      where.status = status;
    }

    return this.prisma.bid.findMany({
      where,
      include: {
        job: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBidById(bidId: string, userId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
        pro: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    // Check authorization
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { proProfile: true },
    });

    const isCustomer = bid.job.customerId === userId;
    const isPro = user?.proProfile?.id === bid.proId;

    if (!isCustomer && !isPro) {
      throw new ForbiddenException('You do not have access to this bid');
    }

    return bid;
  }

  async updateBid(bidId: string, proId: string, dto: UpdateBidDto) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.proId !== proId) {
      throw new ForbiddenException('You can only update your own bids');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException('Can only update PENDING bids');
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: {
        proposedPrice: dto.proposedPrice,
        estimatedDuration: dto.estimatedDuration,
        message: dto.message,
        availableFrom: dto.availableFrom ? new Date(dto.availableFrom) : undefined,
      },
    });
  }

  async withdrawBid(bidId: string, proId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { job: true },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.proId !== proId) {
      throw new ForbiddenException('You can only withdraw your own bids');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException('Can only withdraw PENDING bids');
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.WITHDRAWN },
    });
  }

  async acceptBid(bidId: string, customerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: {
          include: {
            bids: {
              where: { status: BidStatus.PENDING },
            },
          },
        },
        pro: {
          include: {
            user: true,
            services: true,
          },
        },
      },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.job.customerId !== customerId) {
      throw new ForbiddenException('You can only accept bids on your own jobs');
    }

    if (bid.job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Job is not open');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException('Bid is not pending');
    }

    // Use transaction to update bid, job, reject other bids, and create booking
    const result = await this.prisma.$transaction(async (tx) => {
      // Accept the bid
      const acceptedBid = await tx.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
      });

      // Update job status and link accepted bid
      await tx.job.update({
        where: { id: bid.jobId },
        data: {
          status: JobStatus.ACCEPTED,
          acceptedBidId: bidId,
        },
      });

      // Create a booking from the accepted bid
      const scheduledFor = bid.availableFrom || bid.job.preferredDate || new Date();
      
      // Calculate fees (10% platform fee)
      const servicePrice = bid.proposedPrice;
      const platformFee = Math.round(servicePrice * 0.1);
      const total = servicePrice + platformFee;
      
      const booking = await tx.booking.create({
        data: {
          customerId: bid.job.customerId,
          proId: bid.proId,
          serviceId: bid.pro.services[0]?.id || '', // Use first service or empty string
          scheduledFor: scheduledFor,
          description: `${bid.job.title}\n\n${bid.job.description}`,
          customerNotes: bid.message,
          images: bid.job.images || [],
          locationAddr: bid.job.locationAddr,
          locationCity: bid.job.locationCity,
          locationLat: bid.job.locationLat,
          locationLng: bid.job.locationLng,
          servicePrice: servicePrice,
          platformFee: platformFee,
          total: total,
          currency: 'HUF',
          status: 'ACCEPTED',
        },
      });

      // Reject all other pending bids
      const otherBids = bid.job.bids.filter(b => b.id !== bidId);
      for (const otherBid of otherBids) {
        await tx.bid.update({
          where: { id: otherBid.id },
          data: { status: BidStatus.REJECTED },
        });

        // Notify rejected professionals
        const rejectedPro = await tx.proProfile.findUnique({
          where: { id: otherBid.proId },
          include: { user: true },
        });

        if (rejectedPro) {
          await this.notificationsService.create(
            rejectedPro.userId,
            NotificationType.BOOKING_DECLINED,
            'Bid Not Selected',
            `Your bid for "${bid.job.title}" was not selected`,
            { jobId: bid.jobId, bidId: otherBid.id },
          );
        }
      }

      return { acceptedBid, booking };
    });

    // Notify winning professional
    await this.notificationsService.create(
      bid.pro.userId,
      NotificationType.BOOKING_ACCEPTED,
      'Bid Accepted!',
      `Your bid for "${bid.job.title}" has been accepted. A booking has been created.`,
      { jobId: bid.jobId, bidId: bid.id, bookingId: result.booking.id },
    );

    return result;
  }

  async rejectBid(bidId: string, customerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
        pro: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.job.customerId !== customerId) {
      throw new ForbiddenException('You can only reject bids on your own jobs');
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException('Can only reject PENDING bids');
    }

    const rejectedBid = await this.prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.REJECTED },
    });

    // Notify professional
    await this.notificationsService.create(
      bid.pro.userId,
      NotificationType.BOOKING_DECLINED,
      'Bid Rejected',
      `Your bid for "${bid.job.title}" was rejected`,
      { jobId: bid.jobId, bidId: bid.id },
    );

    return rejectedBid;
  }

  // ==================== HELPER METHODS ====================

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private async notifyMatchingProfessionals(job: any) {
    // Find all professionals with matching category and service area
    const pros = await this.prisma.proProfile.findMany({
      where: {
        categories: {
          has: job.category,
        },
        verificationStatus: 'APPROVED',
      },
      include: {
        user: true,
      },
    });

    // Filter by service area
    const matchingPros = pros.filter(pro => {
      const distance = this.calculateDistance(
        pro.locationLat,
        pro.locationLng,
        job.locationLat,
        job.locationLng,
      );
      return distance <= pro.serviceAreaRadius;
    });

    // Notify each matching professional
    for (const pro of matchingPros) {
      await this.notificationsService.create(
        pro.userId,
        NotificationType.BOOKING_REQUEST,
        'New Job Available',
        `New ${job.category} job posted in ${job.locationCity}`,
        { jobId: job.id },
      );
    }
  }

  async expireJobs() {
    const expiredJobs = await this.prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
        expiresAt: {
          lte: new Date(),
        },
      },
      include: {
        customer: true,
      },
    });

    for (const job of expiredJobs) {
      await this.prisma.job.update({
        where: { id: job.id },
        data: { status: JobStatus.EXPIRED },
      });

      // Notify customer
      await this.notificationsService.create(
        job.customerId,
        NotificationType.BOOKING_CANCELLED,
        'Job Expired',
        `Your job "${job.title}" has expired`,
        { jobId: job.id },
      );
    }

    return expiredJobs.length;
  }
}
