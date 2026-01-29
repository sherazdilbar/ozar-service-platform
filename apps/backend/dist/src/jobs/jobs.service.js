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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_enhanced_service_1 = require("../notifications/notifications-enhanced.service");
const client_1 = require("@prisma/client");
let JobsService = class JobsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createJob(customerId, dto) {
        if (dto.budgetMin && dto.budgetMax && dto.budgetMin >= dto.budgetMax) {
            throw new common_1.BadRequestException('budgetMin must be less than budgetMax');
        }
        if (dto.images && dto.images.length > 10) {
            throw new common_1.BadRequestException('Maximum 10 images allowed');
        }
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
                status: client_1.JobStatus.OPEN,
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
        await this.notifyMatchingProfessionals(job);
        return job;
    }
    async findCustomerJobs(customerId, status) {
        const where = { customerId };
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
                    where: { status: client_1.BidStatus.PENDING },
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
    async findJobById(jobId, userId) {
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
            throw new common_1.NotFoundException('Job not found');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { proProfile: true },
        });
        const isCustomer = job.customerId === userId;
        const hasBid = user?.proProfile && job.bids.some(bid => bid.proId === user.proProfile.id);
        const canViewAsProspectiveBidder = user?.proProfile && job.status === client_1.JobStatus.OPEN;
        if (!isCustomer && !hasBid && !canViewAsProspectiveBidder) {
            throw new common_1.ForbiddenException('You do not have access to this job');
        }
        return job;
    }
    async updateJob(jobId, customerId, dto) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only update your own jobs');
        }
        if (job.status !== client_1.JobStatus.OPEN) {
            throw new common_1.BadRequestException('Can only update OPEN jobs');
        }
        if (dto.budgetMin && dto.budgetMax && dto.budgetMin >= dto.budgetMax) {
            throw new common_1.BadRequestException('budgetMin must be less than budgetMax');
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
    async cancelJob(jobId, customerId) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
            include: {
                bids: {
                    where: { status: client_1.BidStatus.PENDING },
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
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only cancel your own jobs');
        }
        if (job.status !== client_1.JobStatus.OPEN) {
            throw new common_1.BadRequestException('Can only cancel OPEN jobs');
        }
        const updatedJob = await this.prisma.job.update({
            where: { id: jobId },
            data: { status: client_1.JobStatus.CANCELLED },
        });
        for (const bid of job.bids) {
            await this.notificationsService.create(bid.pro.userId, notifications_enhanced_service_1.NotificationType.BOOKING_CANCELLED, 'Job Cancelled', `The job "${job.title}" has been cancelled by the customer`, { jobId: job.id, bidId: bid.id });
        }
        return updatedJob;
    }
    async findAvailableJobs(proId, category) {
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: proId },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional profile not found');
        }
        const where = {
            status: client_1.JobStatus.OPEN,
            expiresAt: { gt: new Date() },
            category: category ? category : { in: pro.categories },
            bids: {
                none: {
                    proId: proId,
                },
            },
        };
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
        const filteredJobs = jobs.filter(job => {
            const distance = this.calculateDistance(pro.locationLat, pro.locationLng, job.locationLat, job.locationLng);
            return distance <= pro.serviceAreaRadius;
        }).filter(job => {
            return job._count.bids < 10;
        });
        return filteredJobs;
    }
    async createBid(proId, dto) {
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
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.status !== client_1.JobStatus.OPEN) {
            throw new common_1.BadRequestException('Job is not open for bidding');
        }
        if (job._count.bids >= 10) {
            throw new common_1.ConflictException('Job already has maximum number of bids');
        }
        const existingBid = await this.prisma.bid.findUnique({
            where: {
                jobId_proId: {
                    jobId: dto.jobId,
                    proId: proId,
                },
            },
        });
        if (existingBid) {
            throw new common_1.ConflictException('You have already submitted a bid for this job');
        }
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: proId },
            include: { user: true },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional profile not found');
        }
        if (!pro.categories.includes(job.category)) {
            throw new common_1.BadRequestException('Job category does not match your service categories');
        }
        const distance = this.calculateDistance(pro.locationLat, pro.locationLng, job.locationLat, job.locationLng);
        if (distance > pro.serviceAreaRadius) {
            throw new common_1.BadRequestException('Job is outside your service area');
        }
        const bid = await this.prisma.bid.create({
            data: {
                jobId: dto.jobId,
                proId: proId,
                proposedPrice: dto.proposedPrice,
                estimatedDuration: dto.estimatedDuration,
                message: dto.message,
                availableFrom: dto.availableFrom ? new Date(dto.availableFrom) : null,
                status: client_1.BidStatus.PENDING,
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
        await this.notificationsService.create(job.customerId, notifications_enhanced_service_1.NotificationType.BOOKING_REQUEST, 'New Bid Received', `${pro.user.firstName} ${pro.user.lastName} submitted a bid for "${job.title}"`, { jobId: job.id, bidId: bid.id });
        return bid;
    }
    async findProBids(proId, status) {
        const where = { proId };
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
    async findBidById(bidId, userId) {
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
            throw new common_1.NotFoundException('Bid not found');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { proProfile: true },
        });
        const isCustomer = bid.job.customerId === userId;
        const isPro = user?.proProfile?.id === bid.proId;
        if (!isCustomer && !isPro) {
            throw new common_1.ForbiddenException('You do not have access to this bid');
        }
        return bid;
    }
    async updateBid(bidId, proId, dto) {
        const bid = await this.prisma.bid.findUnique({
            where: { id: bidId },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        if (bid.proId !== proId) {
            throw new common_1.ForbiddenException('You can only update your own bids');
        }
        if (bid.status !== client_1.BidStatus.PENDING) {
            throw new common_1.BadRequestException('Can only update PENDING bids');
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
    async withdrawBid(bidId, proId) {
        const bid = await this.prisma.bid.findUnique({
            where: { id: bidId },
            include: { job: true },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        if (bid.proId !== proId) {
            throw new common_1.ForbiddenException('You can only withdraw your own bids');
        }
        if (bid.status !== client_1.BidStatus.PENDING) {
            throw new common_1.BadRequestException('Can only withdraw PENDING bids');
        }
        return this.prisma.bid.update({
            where: { id: bidId },
            data: { status: client_1.BidStatus.WITHDRAWN },
        });
    }
    async acceptBid(bidId, customerId) {
        const bid = await this.prisma.bid.findUnique({
            where: { id: bidId },
            include: {
                job: {
                    include: {
                        bids: {
                            where: { status: client_1.BidStatus.PENDING },
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
            throw new common_1.NotFoundException('Bid not found');
        }
        if (bid.job.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only accept bids on your own jobs');
        }
        if (bid.job.status !== client_1.JobStatus.OPEN) {
            throw new common_1.BadRequestException('Job is not open');
        }
        if (bid.status !== client_1.BidStatus.PENDING) {
            throw new common_1.BadRequestException('Bid is not pending');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const acceptedBid = await tx.bid.update({
                where: { id: bidId },
                data: { status: client_1.BidStatus.ACCEPTED },
            });
            await tx.job.update({
                where: { id: bid.jobId },
                data: {
                    status: client_1.JobStatus.ACCEPTED,
                    acceptedBidId: bidId,
                },
            });
            const scheduledFor = bid.availableFrom || bid.job.preferredDate || new Date();
            const servicePrice = bid.proposedPrice;
            const platformFee = Math.round(servicePrice * 0.1);
            const total = servicePrice + platformFee;
            const booking = await tx.booking.create({
                data: {
                    customerId: bid.job.customerId,
                    proId: bid.proId,
                    serviceId: bid.pro.services[0]?.id || '',
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
            const otherBids = bid.job.bids.filter(b => b.id !== bidId);
            for (const otherBid of otherBids) {
                await tx.bid.update({
                    where: { id: otherBid.id },
                    data: { status: client_1.BidStatus.REJECTED },
                });
                const rejectedPro = await tx.proProfile.findUnique({
                    where: { id: otherBid.proId },
                    include: { user: true },
                });
                if (rejectedPro) {
                    await this.notificationsService.create(rejectedPro.userId, notifications_enhanced_service_1.NotificationType.BOOKING_DECLINED, 'Bid Not Selected', `Your bid for "${bid.job.title}" was not selected`, { jobId: bid.jobId, bidId: otherBid.id });
                }
            }
            return { acceptedBid, booking };
        });
        await this.notificationsService.create(bid.pro.userId, notifications_enhanced_service_1.NotificationType.BOOKING_ACCEPTED, 'Bid Accepted!', `Your bid for "${bid.job.title}" has been accepted. A booking has been created.`, { jobId: bid.jobId, bidId: bid.id, bookingId: result.booking.id });
        return result;
    }
    async rejectBid(bidId, customerId) {
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
            throw new common_1.NotFoundException('Bid not found');
        }
        if (bid.job.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only reject bids on your own jobs');
        }
        if (bid.status !== client_1.BidStatus.PENDING) {
            throw new common_1.BadRequestException('Can only reject PENDING bids');
        }
        const rejectedBid = await this.prisma.bid.update({
            where: { id: bidId },
            data: { status: client_1.BidStatus.REJECTED },
        });
        await this.notificationsService.create(bid.pro.userId, notifications_enhanced_service_1.NotificationType.BOOKING_DECLINED, 'Bid Rejected', `Your bid for "${bid.job.title}" was rejected`, { jobId: bid.jobId, bidId: bid.id });
        return rejectedBid;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    async notifyMatchingProfessionals(job) {
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
        const matchingPros = pros.filter(pro => {
            const distance = this.calculateDistance(pro.locationLat, pro.locationLng, job.locationLat, job.locationLng);
            return distance <= pro.serviceAreaRadius;
        });
        for (const pro of matchingPros) {
            await this.notificationsService.create(pro.userId, notifications_enhanced_service_1.NotificationType.BOOKING_REQUEST, 'New Job Available', `New ${job.category} job posted in ${job.locationCity}`, { jobId: job.id });
        }
    }
    async expireJobs() {
        const expiredJobs = await this.prisma.job.findMany({
            where: {
                status: client_1.JobStatus.OPEN,
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
                data: { status: client_1.JobStatus.EXPIRED },
            });
            await this.notificationsService.create(job.customerId, notifications_enhanced_service_1.NotificationType.BOOKING_CANCELLED, 'Job Expired', `Your job "${job.title}" has expired`, { jobId: job.id });
        }
        return expiredJobs.length;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_enhanced_service_1.NotificationsEnhancedService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map