import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificationsService {
  constructor(private prisma: PrismaService) {}

  async getCertifications(proId: string) {
    return this.prisma.certification.findMany({
      where: { proId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addCertification(proId: string, data: any) {
    return this.prisma.certification.create({
      data: {
        proId,
        ...data,
        status: 'PENDING',
      },
    });
  }

  async updateCertification(proId: string, certId: string, data: any) {
    const cert = await this.prisma.certification.findFirst({
      where: { id: certId, proId },
    });

    if (!cert) {
      throw new NotFoundException('Certification not found');
    }

    return this.prisma.certification.update({
      where: { id: certId },
      data,
    });
  }

  async deleteCertification(proId: string, certId: string) {
    const cert = await this.prisma.certification.findFirst({
      where: { id: certId, proId },
    });

    if (!cert) {
      throw new NotFoundException('Certification not found');
    }

    await this.prisma.certification.delete({
      where: { id: certId },
    });

    return { success: true };
  }

  async getBadges(proId: string) {
    return this.prisma.badge.findMany({
      where: { proId },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async awardBadge(proId: string, badgeType: string) {
    const badgeConfig = this.getBadgeConfig(badgeType);
    
    return this.prisma.badge.create({
      data: {
        proId,
        badgeType,
        ...badgeConfig,
      },
    });
  }

  private getBadgeConfig(badgeType: string) {
    const badges = {
      VERIFIED: {
        name: 'Verified Professional',
        description: 'Identity and credentials verified',
        icon: '✓',
      },
      TOP_RATED: {
        name: 'Top Rated',
        description: 'Consistently high ratings',
        icon: '⭐',
      },
      QUICK_RESPONDER: {
        name: 'Quick Responder',
        description: 'Responds within 15 minutes',
        icon: '⚡',
      },
      RELIABLE: {
        name: 'Reliable',
        description: '95%+ completion rate',
        icon: '🎯',
      },
      EXPERIENCED: {
        name: 'Experienced',
        description: '100+ completed jobs',
        icon: '🏆',
      },
    };

    return badges[badgeType] || badges.VERIFIED;
  }
}
