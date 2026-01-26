import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalPros,
      pendingPros,
      approvedPros,
      totalBookings,
      activeBookings,
      totalDisputes,
      openDisputes,
      totalRevenue,
    ] = await Promise.all([
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

  async getPros(filters?: {
    status?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, city, page = 1, limit = 20 } = filters || {};

    const where: any = {};
    if (status) where.verificationStatus = status;
    if (city) where.locationCity = city;

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

  async verifyPro(proId: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    return this.prisma.proProfile.update({
      where: { id: proId },
      data: {
        verificationStatus: status,
        // Could add verification notes field
      },
      include: {
        user: true,
      },
    });
  }

  async getAllBookings(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = filters || {};

    const where: any = {};
    if (status) where.status = status;

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

  async getDisputes(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = filters || {};

    const where: any = {};
    if (status) where.status = status;

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

  async resolveDispute(
    disputeId: string,
    adminId: string,
    resolution: string,
    refundAmount?: number,
  ) {
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

    // If refund is approved, update booking
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
}
