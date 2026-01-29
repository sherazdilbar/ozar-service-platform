import { ServiceCategory, JobUrgency } from '@prisma/client';
export declare class CreateJobDto {
    title: string;
    description: string;
    category: ServiceCategory;
    urgency: JobUrgency;
    locationAddr: string;
    locationCity: string;
    locationArea?: string;
    locationLat: number;
    locationLng: number;
    budgetMin?: number;
    budgetMax?: number;
    images?: string[];
    preferredDate?: string;
}
