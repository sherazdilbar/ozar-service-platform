import { JobUrgency } from '@prisma/client';
export declare class UpdateJobDto {
    description?: string;
    urgency?: JobUrgency;
    budgetMin?: number;
    budgetMax?: number;
    images?: string[];
    preferredDate?: string;
}
