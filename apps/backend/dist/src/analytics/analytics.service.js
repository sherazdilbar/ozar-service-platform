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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProAnalytics(userId, period = 'month') {
        const proProfile = await this.prisma.proProfile.findUnique({
            where: { userId },
        });
        if (!proProfile) {
            throw new common_1.NotFoundException('Pro profile not found');
        }
        const now = new Date();
        const startDate = this.getStartDate(period);
        const earnings = await this.getEarnings(proProfile.id, startDate, now);
        const bookingTrends = await this.getBookingTrends(proProfile.id, startDate, now);
        const customerInsights = await this.getCustomerInsights(proProfile.id, startDate, now);
        const performanceMetrics = await this.getPerformanceMetrics(proProfile.id, startDate, now);
        return {
            earnings,
            bookingTrends,
            customerInsights,
            performanceMetrics,
            period,
        };
    }
    async getEarnings(proId, startDate, endDate) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                proId,
                status: 'COMPLETED',
                completedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                total: true,
                platformFee: true,
                completedAt: true,
                currency: true,
            },
        });
        const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
        const totalFees = bookings.reduce((sum, b) => sum + b.platformFee, 0);
        const netEarnings = totalRevenue - totalFees;
        const dailyEarnings = this.groupByDate(bookings, 'completedAt', (items) => items.reduce((sum, b) => sum + (b.total - b.platformFee), 0));
        return {
            totalRevenue,
            totalFees,
            netEarnings,
            currency: bookings[0]?.currency || 'HUF',
            completedJobs: bookings.length,
            dailyEarnings,
        };
    }
    async getBookingTrends(proId, startDate, endDate) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                proId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                status: true,
                createdAt: true,
                isASAP: true,
            },
        });
        const byStatus = bookings.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1;
            return acc;
        }, {});
        const dailyBookings = this.groupByDate(bookings, 'createdAt', (items) => items.length);
        const asapCount = bookings.filter(b => b.isASAP).length;
        const scheduledCount = bookings.length - asapCount;
        return {
            total: bookings.length,
            byStatus,
            dailyBookings,
            asapCount,
            scheduledCount,
        };
    }
    async getCustomerInsights(proId, startDate, endDate) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                proId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                customerId: true,
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        locationCity: true,
                    },
                },
            },
        });
        const uniqueCustomers = new Set(bookings.map(b => b.customerId)).size;
        const customerCounts = bookings.reduce((acc, b) => {
            acc[b.customerId] = (acc[b.customerId] || 0) + 1;
            return acc;
        }, {});
        const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length;
        const topCustomers = Object.entries(customerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([customerId, count]) => {
            const booking = bookings.find(b => b.customerId === customerId);
            return {
                customerId,
                name: `${booking?.customer.firstName} ${booking?.customer.lastName}`,
                bookingCount: count,
            };
        });
        const byLocation = bookings.reduce((acc, b) => {
            const city = b.customer.locationCity || 'Unknown';
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});
        return {
            uniqueCustomers,
            repeatCustomers,
            repeatRate: uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0,
            topCustomers,
            byLocation,
        };
    }
    async getPerformanceMetrics(proId, startDate, endDate) {
        const reviews = await this.prisma.review.findMany({
            where: {
                proId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                rating: true,
                createdAt: true,
            },
        });
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        const ratingDistribution = reviews.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        }, {});
        const acceptedBookings = await this.prisma.booking.findMany({
            where: {
                proId,
                status: {
                    in: ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'],
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                events: {
                    where: {
                        status: 'ACCEPTED',
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    take: 1,
                },
            },
        });
        const responseTimes = acceptedBookings
            .filter(b => b.events.length > 0)
            .map(b => {
            const acceptedAt = b.events[0].createdAt;
            const requestedAt = b.createdAt;
            return (acceptedAt.getTime() - requestedAt.getTime()) / (1000 * 60);
        });
        const averageResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
            : 0;
        const allBookings = await this.prisma.booking.count({
            where: {
                proId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: {
                    in: ['COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PRO'],
                },
            },
        });
        const completedBookings = await this.prisma.booking.count({
            where: {
                proId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'COMPLETED',
            },
        });
        const completionRate = allBookings > 0 ? (completedBookings / allBookings) * 100 : 0;
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            ratingDistribution,
            averageResponseTime: Math.round(averageResponseTime),
            completionRate: Math.round(completionRate * 10) / 10,
        };
    }
    getStartDate(period) {
        const now = new Date();
        switch (period) {
            case 'week':
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case 'month':
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            case 'year':
                return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
    }
    groupByDate(items, dateField, aggregator) {
        const grouped = items.reduce((acc, item) => {
            const date = item[dateField].toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
        return Object.entries(grouped)
            .map(([date, items]) => ({
            date,
            value: aggregator(items),
        }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map