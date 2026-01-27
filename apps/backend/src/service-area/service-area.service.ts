import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceAreaService {
  constructor(private prisma: PrismaService) {}

  async getServiceAreas(proId: string) {
    return this.prisma.serviceArea.findMany({
      where: { proId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addServiceArea(proId: string, data: any) {
    return this.prisma.serviceArea.create({
      data: {
        proId,
        ...data,
      },
    });
  }

  async updateServiceArea(proId: string, areaId: string, data: any) {
    const area = await this.prisma.serviceArea.findFirst({
      where: { id: areaId, proId },
    });

    if (!area) {
      throw new NotFoundException('Service area not found');
    }

    return this.prisma.serviceArea.update({
      where: { id: areaId },
      data,
    });
  }

  async deleteServiceArea(proId: string, areaId: string) {
    const area = await this.prisma.serviceArea.findFirst({
      where: { id: areaId, proId },
    });

    if (!area) {
      throw new NotFoundException('Service area not found');
    }

    await this.prisma.serviceArea.delete({
      where: { id: areaId },
    });

    return { success: true };
  }

  calculateTravelFee(distance: number, baseRate: number = 500): number {
    // Calculate travel fee based on distance
    // Base rate for first 5km, then additional per km
    if (distance <= 5) {
      return 0;
    }
    
    const extraDistance = distance - 5;
    const perKmRate = baseRate / 10; // 50 per km after 5km
    
    return Math.round(extraDistance * perKmRate);
  }

  async isWithinServiceArea(proId: string, lat: number, lng: number): Promise<boolean> {
    const areas = await this.prisma.serviceArea.findMany({
      where: { proId, isActive: true },
    });

    // For simplicity, check if within any service area radius
    // In production, use proper geospatial queries
    for (const area of areas) {
      // This is a simplified check - in production use PostGIS or similar
      const distance = this.calculateDistance(lat, lng, 0, 0); // Would need area coordinates
      if (distance <= area.radius) {
        return true;
      }
    }

    return false;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
