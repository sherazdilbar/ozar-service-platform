import { ServiceAreaService } from './service-area.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ServiceAreaController {
    private serviceAreaService;
    private prisma;
    constructor(serviceAreaService: ServiceAreaService, prisma: PrismaService);
    getServiceAreas(req: any): Promise<{
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
    addServiceArea(req: any, body: any): Promise<{
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
    updateServiceArea(req: any, id: string, body: any): Promise<{
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
    deleteServiceArea(req: any, id: string): Promise<{
        success: boolean;
    }>;
    calculateTravelFee(distance: string): {
        distance: number;
        travelFee: number;
    };
    private getProProfile;
}
