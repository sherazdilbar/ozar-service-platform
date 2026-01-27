import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private prisma;
    private readonly logger;
    private startTime;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: {
            milliseconds: number;
            formatted: string;
        };
    }>;
    detailedCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: {
            milliseconds: number;
            formatted: string;
        };
        version: string;
        environment: string;
        services: {
            database: {
                status: string;
                responseTime: string;
                message: string;
                error?: undefined;
            } | {
                status: string;
                message: string;
                error: any;
                responseTime?: undefined;
            };
            memory: {
                status: string;
                total: string;
                used: string;
                percentage: string;
            };
            disk: {
                status: string;
                message: string;
            };
        };
    }>;
    private checkDatabase;
    private checkMemory;
    private checkDisk;
    private getUptime;
}
