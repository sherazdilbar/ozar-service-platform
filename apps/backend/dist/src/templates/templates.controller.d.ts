import { TemplatesService } from './templates.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class TemplatesController {
    private templatesService;
    private prisma;
    constructor(templatesService: TemplatesService, prisma: PrismaService);
    getResponseTemplates(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        proId: string;
        content: string;
        usageCount: number;
    }[]>;
    createResponseTemplate(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        proId: string;
        content: string;
        usageCount: number;
    }>;
    updateResponseTemplate(req: any, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        proId: string;
        content: string;
        usageCount: number;
    }>;
    deleteResponseTemplate(req: any, id: string): Promise<{
        success: boolean;
    }>;
    getAutoResponses(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }[]>;
    createAutoResponse(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }>;
    updateAutoResponse(req: any, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }>;
    deleteAutoResponse(req: any, id: string): Promise<{
        success: boolean;
    }>;
    getQuickMessages(req: any): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }[]>;
    createQuickMessage(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }>;
    updateQuickMessage(req: any, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }>;
    deleteQuickMessage(req: any, id: string): Promise<{
        success: boolean;
    }>;
    private getProProfile;
}
