import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(proId?: string, categoryId?: string) {
    const where: any = {};

    if (proId) {
      where.proId = proId;
    }

    if (categoryId) {
      where.category = categoryId;
    }

    return this.prisma.service.findMany({
      where,
      include: {
        pro: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async getProByUserId(userId: string) {
    return this.prisma.proProfile.findUnique({
      where: { userId },
    });
  }

  async create(proId: string, dto: CreateServiceDto) {
    // Verify pro exists
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: proId },
    });

    if (!pro) {
      throw new NotFoundException('Professional not found');
    }

    const service = await this.prisma.service.create({
      data: {
        proId,
        name: dto.name,
        description: dto.description,
        category: dto.category as any,
        pricingModel: dto.pricingModel as any,
        price: dto.price,
        duration: dto.duration,
        currency: dto.currency,
      },
    });

    // Update pro's starting price and currency
    await this.updateProPricing(proId);

    return service;
  }

  async delete(serviceId: string, userId: string) {
    // Get service with pro info
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        pro: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (service.pro.userId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.prisma.service.delete({
      where: { id: serviceId },
    });

    // Update pro's starting price after deletion
    await this.updateProPricing(service.proId);

    return service;
  }

  async update(serviceId: string, userId: string, dto: CreateServiceDto) {
    // Get service with pro info
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        pro: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (service.pro.userId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    const updated = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category as any,
        pricingModel: dto.pricingModel as any,
        price: dto.price,
        duration: dto.duration,
        currency: dto.currency,
      },
    });

    // Update pro's starting price after update
    await this.updateProPricing(service.proId);

    return updated;
  }

  async toggleStatus(serviceId: string, userId: string) {
    // Get service with pro info
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        pro: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (service.pro.userId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    const updated = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        isActive: !service.isActive,
      },
    });

    return updated;
  }

  /**
   * Update pro's starting price and currency based on their services
   */
  private async updateProPricing(proId: string) {
    const services = await this.prisma.service.findMany({
      where: { proId },
      orderBy: { price: 'asc' },
    });

    if (services.length > 0) {
      // Get the lowest price and its currency
      const lowestPriceService = services[0];
      
      await this.prisma.proProfile.update({
        where: { id: proId },
        data: {
          startingPrice: lowestPriceService.price,
          currency: lowestPriceService.currency,
        },
      });
    } else {
      // No services, reset to defaults
      await this.prisma.proProfile.update({
        where: { id: proId },
        data: {
          startingPrice: 0,
          currency: 'USD',
        },
      });
    }
  }
}
