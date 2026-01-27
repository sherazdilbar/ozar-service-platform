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
    async getSchedule(proId) {
        const schedules = await this.prisma.availabilitySchedule.findMany({
            where: { proId },
            orderBy: { dayOfWeek: 'asc' },
        });
        return schedules;
    }
    async updateSchedule(proId, schedules) {
        await this.prisma.availabilitySchedule.deleteMany({
            where: { proId },
        });
        const created = await this.prisma.availabilitySchedule.createMany({
            data: schedules.map(schedule => ({
                proId,
                ...schedule,
            })),
        });
        return { success: true, count: created.count };
    }
    async addTimeOff(proId, data) {
        const timeOff = await this.prisma.timeOff.create({
            data: {
                proId,
                ...data,
            },
        });
        return timeOff;
    }
    async getTimeOffs(proId) {
        const timeOffs = await this.prisma.timeOff.findMany({
            where: {
                proId,
                endDate: {
                    gte: new Date(),
                },
            },
            orderBy: { startDate: 'asc' },
        });
        return timeOffs;
    }
    async deleteTimeOff(proId, timeOffId) {
        const timeOff = await this.prisma.timeOff.findFirst({
            where: { id: timeOffId, proId },
        });
        if (!timeOff) {
            throw new common_1.NotFoundException('Time off not found');
        }
        await this.prisma.timeOff.delete({
            where: { id: timeOffId },
        });
        return { success: true };
    }
    async isAvailable(proId, dateTime) {
        const dayOfWeek = this.getDayOfWeek(dateTime);
        const time = this.formatTime(dateTime);
        const schedules = await this.prisma.availabilitySchedule.findMany({
            where: {
                proId,
                dayOfWeek,
                isActive: true,
            },
        });
        if (schedules.length === 0) {
            return false;
        }
        const isInSchedule = schedules.some(schedule => {
            return time >= schedule.startTime && time <= schedule.endTime;
        });
        if (!isInSchedule) {
            return false;
        }
        const timeOff = await this.prisma.timeOff.findFirst({
            where: {
                proId,
                startDate: { lte: dateTime },
                endDate: { gte: dateTime },
            },
        });
        return !timeOff;
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map