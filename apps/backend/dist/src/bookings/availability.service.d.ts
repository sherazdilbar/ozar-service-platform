import { PrismaService } from '../prisma/prisma.service';
export declare class AvailabilityService {
    private prisma;
    constructor(prisma: PrismaService);
    checkAvailability(proId: string, scheduledFor: Date, durationMinutes: number): Promise<void>;
    lockTimeSlot(proId: string, scheduledFor: Date, durationMinutes: number, bookingId: string): Promise<void>;
    getAvailableSlots(proId: string, date: Date, durationMinutes: number): Promise<Date[]>;
    isAvailableNow(proId: string): Promise<boolean>;
}
