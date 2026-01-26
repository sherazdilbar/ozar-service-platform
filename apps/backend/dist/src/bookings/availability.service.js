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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AvailabilityService = class AvailabilityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAvailability(proId, scheduledFor, durationMinutes) {
        const endTime = new Date(scheduledFor);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
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
        for (const booking of overlapping) {
            if (!booking.scheduledFor)
                continue;
            const bookingEnd = new Date(booking.scheduledFor);
            bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);
            const hasOverlap = scheduledFor < bookingEnd && endTime > booking.scheduledFor;
            if (hasOverlap) {
                throw new common_1.ConflictException(`Time slot not available. Professional has another booking from ` +
                    `${booking.scheduledFor.toLocaleTimeString()} to ${bookingEnd.toLocaleTimeString()}`);
            }
        }
    }
    async lockTimeSlot(proId, scheduledFor, durationMinutes, bookingId) {
        await this.prisma.$transaction(async (tx) => {
            const endTime = new Date(scheduledFor);
            endTime.setMinutes(endTime.getMinutes() + durationMinutes);
            const overlapping = await tx.booking.findMany({
                where: {
                    proId,
                    id: { not: bookingId },
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
                        gte: new Date(scheduledFor.getTime() - 24 * 60 * 60 * 1000),
                        lte: new Date(endTime.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
                include: {
                    service: true,
                },
            });
            for (const booking of overlapping) {
                if (!booking.scheduledFor)
                    continue;
                const bookingEnd = new Date(booking.scheduledFor);
                bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);
                const hasOverlap = scheduledFor < bookingEnd && endTime > booking.scheduledFor;
                if (hasOverlap) {
                    throw new common_1.ConflictException('Time slot was just booked by another customer. Please choose a different time.');
                }
            }
            await tx.booking.update({
                where: { id: bookingId },
                data: { updatedAt: new Date() },
            });
        });
    }
    async getAvailableSlots(proId, date, durationMinutes) {
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
        const slots = [];
        const workStart = new Date(date);
        workStart.setHours(9, 0, 0, 0);
        const workEnd = new Date(date);
        workEnd.setHours(18, 0, 0, 0);
        let currentSlot = new Date(workStart);
        while (currentSlot < workEnd) {
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);
            let isAvailable = true;
            for (const booking of bookings) {
                if (!booking.scheduledFor)
                    continue;
                const bookingEnd = new Date(booking.scheduledFor);
                bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.service.duration);
                const hasOverlap = currentSlot < bookingEnd && slotEnd > booking.scheduledFor;
                if (hasOverlap) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable && slotEnd <= workEnd) {
                slots.push(new Date(currentSlot));
            }
            currentSlot.setMinutes(currentSlot.getMinutes() + 30);
        }
        return slots;
    }
    async isAvailableNow(proId) {
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
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map