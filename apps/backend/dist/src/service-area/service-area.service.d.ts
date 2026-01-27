import { PrismaService } from '../prisma/prisma.service';
export declare class ServiceAreaService {
    private prisma;
    constructor(prisma: PrismaService);
    getServiceAreas(proId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        city: string;
        area: string | null;
        radius: number;
        travelFee: number;
    }[]>;
    addServiceArea(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        city: string;
        area: string | null;
        radius: number;
        travelFee: number;
    }>;
    updateServiceArea(proId: string, areaId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        city: string;
        area: string | null;
        radius: number;
        travelFee: number;
    }>;
    deleteServiceArea(proId: string, areaId: string): Promise<{
        success: boolean;
    }>;
    calculateTravelFee(distance: number, baseRate?: number): number;
    isWithinServiceArea(proId: string, lat: number, lng: number): Promise<boolean>;
    private calculateDistance;
    private deg2rad;
}
