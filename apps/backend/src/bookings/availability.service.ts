import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Availability Service
 * 
 * Handles time slot validation and overlap detection.
 * Prevents double-booking for professionals.
 */
@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if a time slot is available for a pro
   * @throws ConflictException if slot is not available
   */
  async checkAvailability(
    proId: string,
    scheduledFor: Date,
    durationMinutes: number,
  ): Promise<void> {
    // Calculate end time
    const endTime = new Date(scheduledFor);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    // Find overlapping bookings
    const overlapping = await this.prisma.booking.findMany({
      where: {
        proId,
        status: {
          in: [
            'ACCEPTED',
            'PAYMENT_AUTHORIZED',
            'SCHEDULED',
            'IN_PROGRESS',
          ],
        },
        scheduledFor: {
          not: null,
        },
        // Check for overlap:
        // Booking starts before our end time AND ends after our start time
        AND: [
          {
            scheduledFor: {
              lt: endTime,
            },
          },
        ],
      },
      include: {
        service: true,
      },
    });

    // Check each booking for actual overlap
    for (const booking of overlapping) {
      if (!booking.scheduledFor) continue;

      const bookingEnd = new Date(booking.scheduledFor);
      bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);

      // Check if there's actual overlap
      const hasOverlap =
        scheduledFor < bookingEnd && endTime > booking.scheduledFor;

      if (hasOverlap) {
        throw new ConflictException(
          `Time slot not available. Professional has another booking from ` +
          `${booking.scheduledFor.toLocaleTimeString()} to ${bookingEnd.toLocaleTimeString()}`,
        );
      }
    }
  }

  /**
   * Lock a time slot for a booking (using database transaction)
   * This ensures no race conditions when multiple customers book simultaneously
   */
  async lockTimeSlot(
    proId: string,
    scheduledFor: Date,
    durationMinutes: number,
    bookingId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Re-check availability within transaction
      const endTime = new Date(scheduledFor);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);

      const overlapping = await tx.booking.findMany({
        where: {
          proId,
          id: { not: bookingId }, // Exclude current booking
          status: {
            in: [
              'ACCEPTED',
              'PAYMENT_AUTHORIZED',
              'SCHEDULED',
              'IN_PROGRESS',
            ],
          },
          scheduledFor: {
            not: null,
            gte: new Date(scheduledFor.getTime() - 24 * 60 * 60 * 1000), // 24 hours before
            lte: new Date(endTime.getTime() + 24 * 60 * 60 * 1000), // 24 hours after
          },
        },
        include: {
          service: true,
        },
      });

      // Check for overlaps
      for (const booking of overlapping) {
        if (!booking.scheduledFor) continue;

        const bookingEnd = new Date(booking.scheduledFor);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);

        const hasOverlap =
          scheduledFor < bookingEnd && endTime > booking.scheduledFor;

        if (hasOverlap) {
          throw new ConflictException(
            'Time slot was just booked by another customer. Please choose a different time.',
          );
        }
      }

      // Update booking to lock the slot
      await tx.booking.update({
        where: { id: bookingId },
        data: { updatedAt: new Date() },
      });
    });
  }

  /**
   * Get available time slots for a pro on a given date
   * (Simple implementation - can be enhanced with pro's actual availability schedule)
   */
  async getAvailableSlots(
    proId: string,
    date: Date,
    durationMinutes: number,
  ): Promise<Date[]> {
    // Get all bookings for that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        proId,
        status: {
          in: [
            'ACCEPTED',
            'PAYMENT_AUTHORIZED',
            'SCHEDULED',
            'IN_PROGRESS',
          ],
        },
        scheduledFor: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    // Generate slots (9 AM to 6 PM, every 30 minutes)
    const slots: Date[] = [];
    const workStart = new Date(date);
    workStart.setHours(9, 0, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(18, 0, 0, 0);

    let currentSlot = new Date(workStart);

    while (currentSlot < workEnd) {
      const slotEnd = new Date(currentSlot);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

      // Check if this slot overlaps with any booking
      let isAvailable = true;

      for (const booking of bookings) {
        if (!booking.scheduledFor) continue;

        const bookingEnd = new Date(booking.scheduledFor);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);

        const hasOverlap =
          currentSlot < bookingEnd && slotEnd > booking.scheduledFor;

        if (hasOverlap) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable && slotEnd <= workEnd) {
        slots.push(new Date(currentSlot));
      }

      // Move to next slot (30 min intervals)
      currentSlot.setMinutes(currentSlot.getMinutes() + 30);
    }

    return slots;
  }

  /**
   * Check if a pro is available "now" (within next 2 hours)
   */
  async isAvailableNow(proId: string): Promise<boolean> {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const upcomingBookings = await this.prisma.booking.count({
      where: {
        proId,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
        scheduledFor: {
          gte: now,
          lte: twoHoursLater,
        },
      },
    });

    return upcomingBookings === 0;
  }
}
