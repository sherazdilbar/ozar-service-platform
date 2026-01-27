"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesService = class TemplatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getResponseTemplates(proId) {
        return this.prisma.responseTemplate.findMany({
            where: { proId },
            orderBy: { usageCount: 'desc' },
        });
    }
    async createResponseTemplate(proId, data) {
        return this.prisma.responseTemplate.create({
            data: {
                proId,
                ...data,
            },
        });
    }
    async updateResponseTemplate(proId, templateId, data) {
        const template = await this.prisma.responseTemplate.findFirst({
            where: { id: templateId, proId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return this.prisma.responseTemplate.update({
            where: { id: templateId },
            data,
        });
    }
    async deleteResponseTemplate(proId, templateId) {
        const template = await this.prisma.responseTemplate.findFirst({
            where: { id: templateId, proId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        await this.prisma.responseTemplate.delete({
            where: { id: templateId },
        });
        return { success: true };
    }
    async incrementTemplateUsage(templateId) {
        await this.prisma.responseTemplate.update({
            where: { id: templateId },
            data: {
                usageCount: {
                    increment: 1,
                },
            },
        });
    }
    async getAutoResponses(proId) {
        return this.prisma.autoResponse.findMany({
            where: { proId },
        });
    }
    async createAutoResponse(proId, data) {
        return this.prisma.autoResponse.create({
            data: {
                proId,
                ...data,
            },
        });
    }
    async updateAutoResponse(proId, responseId, data) {
        const response = await this.prisma.autoResponse.findFirst({
            where: { id: responseId, proId },
        });
        if (!response) {
            throw new common_1.NotFoundException('Auto response not found');
        }
        return this.prisma.autoResponse.update({
            where: { id: responseId },
            data,
        });
    }
    async deleteAutoResponse(proId, responseId) {
        const response = await this.prisma.autoResponse.findFirst({
            where: { id: responseId, proId },
        });
        if (!response) {
            throw new common_1.NotFoundException('Auto response not found');
        }
        await this.prisma.autoResponse.delete({
            where: { id: responseId },
        });
        return { success: true };
    }
    async getQuickMessages(proId) {
        return this.prisma.quickMessage.findMany({
            where: { proId },
            orderBy: { usageCount: 'desc' },
        });
    }
    async createQuickMessage(proId, data) {
        return this.prisma.quickMessage.create({
            data: {
                proId,
                ...data,
            },
        });
    }
    async updateQuickMessage(proId, messageId, data) {
        const message = await this.prisma.quickMessage.findFirst({
            where: { id: messageId, proId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Quick message not found');
        }
        return this.prisma.quickMessage.update({
            where: { id: messageId },
            data,
        });
    }
    async deleteQuickMessage(proId, messageId) {
        const message = await this.prisma.quickMessage.findFirst({
            where: { id: messageId, proId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Quick message not found');
        }
        await this.prisma.quickMessage.delete({
            where: { id: messageId },
        });
        return { success: true };
    }
    async incrementQuickMessageUsage(messageId) {
        await this.prisma.quickMessage.update({
            where: { id: messageId },
            data: {
                usageCount: {
                    increment: 1,
                },
            },
        });
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map