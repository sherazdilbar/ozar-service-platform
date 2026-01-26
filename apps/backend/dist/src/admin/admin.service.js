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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalPros, pendingPros, approvedPros, totalBookings, activeBookings, totalDisputes, openDisputes, totalRevenue,] = await Promise.all([
            this.prisma.proProfile.count(),
            this.prisma.proProfile.count({ where: { verificationStatus: 'PENDING' } }),
            this.prisma.proProfile.count({ where: { verificationStatus: 'APPROVED' } }),
            this.prisma.booking.count(),
            this.prisma.booking.count({
                where: {
                    status: {
                        in: ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'],
                    },
                },
            }),
            this.prisma.dispute.count(),
            this.prisma.dispute.count({ where: { status: 'OPEN' } }),
            this.prisma.booking.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { platformFee: true },
            }),
        ]);
        return {
            pros: {
                total: totalPros,
                pending: pendingPros,
                approved: approvedPros,
            },
            bookings: {
                total: totalBookings,
                active: activeBookings,
            },
            disputes: {
                total: totalDisputes,
                open: openDisputes,
            },
            revenue: {
                total: totalRevenue._sum.platformFee || 0,
            },
        };
    }
    async getPros(filters) {
        const { status, city, page = 1, limit = 20 } = filters || {};
        const where = {};
        if (status)
            where.verificationStatus = status;
        if (city)
            where.locationCity = city;
        const pros = await this.prisma.proProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        createdAt: true,
                    },
                },
                services: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.prisma.proProfile.count({ where });
        return {
            data: pros,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async verifyPro(proId, status, reason) {
        return this.prisma.proProfile.update({
            where: { id: proId },
            data: {
                verificationStatus: status,
            },
            include: {
                user: true,
            },
        });
    }
    async getAllBookings(filters) {
        const { status, page = 1, limit = 20 } = filters || {};
        const where = {};
        if (status)
            where.status = status;
        const bookings = await this.prisma.booking.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
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
                            },
                        },
                    },
                },
                service: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
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
    async getDisputes(filters) {
        const { status, page = 1, limit = 20 } = filters || {};
        const where = {};
        if (status)
            where.status = status;
        const disputes = await this.prisma.dispute.findMany({
            where,
            include: {
                booking: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        pro: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
                raisedByUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                resolver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.prisma.dispute.count({ where });
        return {
            data: disputes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async resolveDispute(disputeId, adminId, resolution, refundAmount) {
        const dispute = await this.prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: 'RESOLVED',
                resolution,
                resolvedBy: adminId,
                resolvedAt: new Date(),
            },
            include: {
                booking: true,
            },
        });
        if (refundAmount && refundAmount > 0) {
            await this.prisma.booking.update({
                where: { id: dispute.bookingId },
                data: {
                    refundAmount,
                    status: 'REFUNDED',
                },
            });
        }
        return dispute;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map