import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get pro analytics dashboard data
   */
  async getProAnalytics(userId: string, period: 'week' | 'month' | 'year' = 'month') {
    // Get pro profile
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const now = new Date();
    const startDate = this.getStartDate(period);

    // Get earnings data
    const earnings = await this.getEarnings(proProfile.id, startDate, now);

    // Get booking trends
    const bookingTrends = await this.getBookingTrends(proProfile.id, startDate, now);

    // Get customer insights
    const customerInsights = await this.getCustomerInsights(proProfile.id, startDate, now);

    // Get performance metrics
    const performanceMetrics = await this.getPerformanceMetrics(proProfile.id, startDate, now);

    return {
      earnings,
      bookingTrends,
      customerInsights,
      performanceMetrics,
      period,
    };
  }

  /**
   * Get earnings overview
   */
  private async getEarnings(proId: string, startDate: Date, endDate: Date) {
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

    // Calculate daily earnings for chart
    const dailyEarnings = this.groupByDate(bookings, 'completedAt', (items) =>
      items.reduce((sum, b) => sum + (b.total - b.platformFee), 0)
    );

    return {
      totalRevenue,
      totalFees,
      netEarnings,
      currency: bookings[0]?.currency || 'HUF',
      completedJobs: bookings.length,
      dailyEarnings,
    };
  }

  /**
   * Get booking trends
   */
  private async getBookingTrends(proId: string, startDate: Date, endDate: Date) {
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

    // Group by status
    const byStatus = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by date
    const dailyBookings = this.groupByDate(bookings, 'createdAt', (items) => items.length);

    // ASAP vs Scheduled
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

  /**
   * Get customer insights
   */
  private async getCustomerInsights(proId: string, startDate: Date, endDate: Date) {
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

    // Unique customers
    const uniqueCustomers = new Set(bookings.map(b => b.customerId)).size;

    // Repeat customers
    const customerCounts = bookings.reduce((acc, b) => {
      acc[b.customerId] = (acc[b.customerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length;

    // Top customers
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

    // Customers by location
    const byLocation = bookings.reduce((acc, b) => {
      const city = b.customer.locationCity || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      uniqueCustomers,
      repeatCustomers,
      repeatRate: uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0,
      topCustomers,
      byLocation,
    };
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(proId: string, startDate: Date, endDate: Date) {
    // Get reviews
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

    // Rating distribution
    const ratingDistribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Get response times (time from REQUESTED to ACCEPTED)
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
        return (acceptedAt.getTime() - requestedAt.getTime()) / (1000 * 60); // minutes
      });

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
      : 0;

    // Completion rate
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

  /**
   * Helper: Get start date based on period
   */
  private getStartDate(period: 'week' | 'month' | 'year'): Date {
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

  /**
   * Helper: Group items by date
   */
  private groupByDate<T>(
    items: T[],
    dateField: keyof T,
    aggregator: (items: T[]) => number
  ): Array<{ date: string; value: number }> {
    const grouped = items.reduce((acc, item) => {
      const date = (item[dateField] as any as Date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, T[]>);

    return Object.entries(grouped)
      .map(([date, items]) => ({
        date,
        value: aggregator(items),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
