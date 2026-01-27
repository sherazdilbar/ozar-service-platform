import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getSchedule(proId: string) {
    const schedules = await this.prisma.availabilitySchedule.findMany({
      where: { proId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return schedules;
  }

  async updateSchedule(proId: string, schedules: any[]) {
    // Delete existing schedules
    await this.prisma.availabilitySchedule.deleteMany({
      where: { proId },
    });

    // Create new schedules
    const created = await this.prisma.availabilitySchedule.createMany({
      data: schedules.map(schedule => ({
        proId,
        ...schedule,
      })),
    });

    return { success: true, count: created.count };
  }

  async addTimeOff(proId: string, data: any) {
    const timeOff = await this.prisma.timeOff.create({
      data: {
        proId,
        ...data,
      },
    });

    return timeOff;
  }

  async getTimeOffs(proId: string) {
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

  async deleteTimeOff(proId: string, timeOffId: string) {
    const timeOff = await this.prisma.timeOff.findFirst({
      where: { id: timeOffId, proId },
    });

    if (!timeOff) {
      throw new NotFoundException('Time off not found');
    }

    await this.prisma.timeOff.delete({
      where: { id: timeOffId },
    });

    return { success: true };
  }

  async isAvailable(proId: string, dateTime: Date): Promise<boolean> {
    const dayOfWeek = this.getDayOfWeek(dateTime) as any;
    const time = this.formatTime(dateTime);

    // Check if there's a schedule for this day
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

    // Check if time falls within any schedule
    const isInSchedule = schedules.some(schedule => {
      return time >= schedule.startTime && time <= schedule.endTime;
    });

    if (!isInSchedule) {
      return false;
    }

    // Check if there's a time off
    const timeOff = await this.prisma.timeOff.findFirst({
      where: {
        proId,
        startDate: { lte: dateTime },
        endDate: { gte: dateTime },
      },
    });

    return !timeOff;
  }

  private getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
