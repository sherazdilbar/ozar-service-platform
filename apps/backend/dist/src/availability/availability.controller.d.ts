import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AvailabilityController {
    private availabilityService;
    private prisma;
    constructor(availabilityService: AvailabilityService, prisma: PrismaService);
    getSchedule(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
        startTime: string;
        endTime: string;
    }[]>;
    updateSchedule(req: any, body: {
        schedules: any[];
    }): Promise<{
        success: boolean;
        count: number;
    }>;
    getTimeOffs(req: any): Promise<{
        id: string;
        createdAt: Date;
        proId: string;
        reason: string | null;
        startDate: Date;
        endDate: Date;
    }[]>;
    addTimeOff(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        proId: string;
        reason: string | null;
        startDate: Date;
        endDate: Date;
    }>;
    deleteTimeOff(req: any, id: string): Promise<{
        success: boolean;
    }>;
    private getProProfile;
}
