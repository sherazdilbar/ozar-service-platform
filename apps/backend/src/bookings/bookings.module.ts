import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingStateMachineService } from './booking-state-machine.service';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingStateMachineService,
    AvailabilityService,
    PrismaService,
  ],
})
export class BookingsModule {}
