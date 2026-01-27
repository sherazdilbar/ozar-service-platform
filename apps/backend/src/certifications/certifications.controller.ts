import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificationsService } from './certifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('certifications')
@UseGuards(JwtAuthGuard)
export class CertificationsController {
  constructor(
    private certificationsService: CertificationsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getCertifications(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.certificationsService.getCertifications(proProfile.id);
  }

  @Post()
  async addCertification(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.certificationsService.addCertification(proProfile.id, body);
  }

  @Put(':id')
  async updateCertification(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.certificationsService.updateCertification(proProfile.id, id, body);
  }

  @Delete(':id')
  async deleteCertification(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.certificationsService.deleteCertification(proProfile.id, id);
  }

  @Get('badges')
  async getBadges(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.certificationsService.getBadges(proProfile.id);
  }

  private async getProProfile(userId: string) {
    const profile = await this.prisma.proProfile.findFirst({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Pro profile not found');
    }
    return profile;
  }
}
