import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProAnalytics(userId: string, period?: 'week' | 'month' | 'year'): Promise<{
        earnings: {
            totalRevenue: number;
            totalFees: number;
            netEarnings: number;
            currency: string;
            completedJobs: number;
            dailyEarnings: {
                date: string;
                value: number;
            }[];
        };
        bookingTrends: {
            total: number;
            byStatus: Record<string, number>;
            dailyBookings: {
                date: string;
                value: number;
            }[];
            asapCount: number;
            scheduledCount: number;
        };
        customerInsights: {
            uniqueCustomers: number;
            repeatCustomers: number;
            repeatRate: number;
            topCustomers: {
                customerId: string;
                name: string;
                bookingCount: number;
            }[];
            byLocation: Record<string, number>;
        };
        performanceMetrics: {
            averageRating: number;
            totalReviews: number;
            ratingDistribution: Record<number, number>;
            averageResponseTime: number;
            completionRate: number;
        };
        period: "year" | "week" | "month";
    }>;
    private getEarnings;
    private getBookingTrends;
    private getCustomerInsights;
    private getPerformanceMetrics;
    private getStartDate;
    private groupByDate;
}
