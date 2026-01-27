import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  // Response Templates
  async getResponseTemplates(proId: string) {
    return this.prisma.responseTemplate.findMany({
      where: { proId },
      orderBy: { usageCount: 'desc' },
    });
  }

  async createResponseTemplate(proId: string, data: any) {
    return this.prisma.responseTemplate.create({
      data: {
        proId,
        ...data,
      },
    });
  }

  async updateResponseTemplate(proId: string, templateId: string, data: any) {
    const template = await this.prisma.responseTemplate.findFirst({
      where: { id: templateId, proId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.responseTemplate.update({
      where: { id: templateId },
      data,
    });
  }

  async deleteResponseTemplate(proId: string, templateId: string) {
    const template = await this.prisma.responseTemplate.findFirst({
      where: { id: templateId, proId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.prisma.responseTemplate.delete({
      where: { id: templateId },
    });

    return { success: true };
  }

  async incrementTemplateUsage(templateId: string) {
    await this.prisma.responseTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  // Auto Responses
  async getAutoResponses(proId: string) {
    return this.prisma.autoResponse.findMany({
      where: { proId },
    });
  }

  async createAutoResponse(proId: string, data: any) {
    return this.prisma.autoResponse.create({
      data: {
        proId,
        ...data,
      },
    });
  }

  async updateAutoResponse(proId: string, responseId: string, data: any) {
    const response = await this.prisma.autoResponse.findFirst({
      where: { id: responseId, proId },
    });

    if (!response) {
      throw new NotFoundException('Auto response not found');
    }

    return this.prisma.autoResponse.update({
      where: { id: responseId },
      data,
    });
  }

  async deleteAutoResponse(proId: string, responseId: string) {
    const response = await this.prisma.autoResponse.findFirst({
      where: { id: responseId, proId },
    });

    if (!response) {
      throw new NotFoundException('Auto response not found');
    }

    await this.prisma.autoResponse.delete({
      where: { id: responseId },
    });

    return { success: true };
  }

  // Quick Messages
  async getQuickMessages(proId: string) {
    return this.prisma.quickMessage.findMany({
      where: { proId },
      orderBy: { usageCount: 'desc' },
    });
  }

  async createQuickMessage(proId: string, data: any) {
    return this.prisma.quickMessage.create({
      data: {
        proId,
        ...data,
      },
    });
  }

  async updateQuickMessage(proId: string, messageId: string, data: any) {
    const message = await this.prisma.quickMessage.findFirst({
      where: { id: messageId, proId },
    });

    if (!message) {
      throw new NotFoundException('Quick message not found');
    }

    return this.prisma.quickMessage.update({
      where: { id: messageId },
      data,
    });
  }

  async deleteQuickMessage(proId: string, messageId: string) {
    const message = await this.prisma.quickMessage.findFirst({
      where: { id: messageId, proId },
    });

    if (!message) {
      throw new NotFoundException('Quick message not found');
    }

    await this.prisma.quickMessage.delete({
      where: { id: messageId },
    });

    return { success: true };
  }

  async incrementQuickMessageUsage(messageId: string) {
    await this.prisma.quickMessage.update({
      where: { id: messageId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}
