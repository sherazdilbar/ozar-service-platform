import { PrismaService } from '../prisma/prisma.service';
export declare class AvailabilityService {
    private prisma;
    constructor(prisma: PrismaService);
    getSchedule(proId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
        startTime: string;
        endTime: string;
    }[]>;
    updateSchedule(proId: string, schedules: any[]): Promise<{
        success: boolean;
        count: number;
    }>;
    addTimeOff(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        proId: string;
        reason: string | null;
        startDate: Date;
        endDate: Date;
    }>;
    getTimeOffs(proId: string): Promise<{
        id: string;
        createdAt: Date;
        proId: string;
        reason: string | null;
        startDate: Date;
        endDate: Date;
    }[]>;
    deleteTimeOff(proId: string, timeOffId: string): Promise<{
        success: boolean;
    }>;
    isAvailable(proId: string, dateTime: Date): Promise<boolean>;
    private getDayOfWeek;
    private formatTime;
}
