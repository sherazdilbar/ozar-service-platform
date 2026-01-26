import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async createDispute(
    userId: string,
    bookingId: string,
    reason: string,
    description: string,
  ) {
    // Verify user is part of the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { pro: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId && booking.pro.userId !== userId) {
      throw new ForbiddenException('You are not part of this booking');
    }

    return this.prisma.dispute.create({
      data: {
        bookingId,
        raisedBy: userId,
        reason,
        description,
      },
      include: {
        booking: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
      },
    });
  }

  async getUserDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: {
        OR: [
          { raisedBy: userId },
          { booking: { customerId: userId } },
          { booking: { pro: { userId } } },
        ],
      },
      include: {
        booking: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDisputeById(disputeId: string, userId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: {
          include: {
            customer: true,
            pro: {
              include: {
                user: true,
              },
            },
          },
        },
        raisedByUser: true,
        resolver: true,
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Verify user has access
    if (
      dispute.raisedBy !== userId &&
      dispute.booking.customerId !== userId &&
      dispute.booking.pro.userId !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return dispute;
  }
}
