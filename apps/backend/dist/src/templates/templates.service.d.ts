import { PrismaService } from '../prisma/prisma.service';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    getResponseTemplates(proId: string): Promise<{
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
    createResponseTemplate(proId: string, data: any): Promise<{
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
    updateResponseTemplate(proId: string, templateId: string, data: any): Promise<{
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
    deleteResponseTemplate(proId: string, templateId: string): Promise<{
        success: boolean;
    }>;
    incrementTemplateUsage(templateId: string): Promise<void>;
    getAutoResponses(proId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }[]>;
    createAutoResponse(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }>;
    updateAutoResponse(proId: string, responseId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        proId: string;
        message: string;
        trigger: string;
    }>;
    deleteAutoResponse(proId: string, responseId: string): Promise<{
        success: boolean;
    }>;
    getQuickMessages(proId: string): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }[]>;
    createQuickMessage(proId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }>;
    updateQuickMessage(proId: string, messageId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        proId: string;
        message: string;
        usageCount: number;
    }>;
    deleteQuickMessage(proId: string, messageId: string): Promise<{
        success: boolean;
    }>;
    incrementQuickMessageUsage(messageId: string): Promise<void>;
}
