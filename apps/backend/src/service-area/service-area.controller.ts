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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceAreaService } from './service-area.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('service-areas')
@UseGuards(JwtAuthGuard)
export class ServiceAreaController {
  constructor(
    private serviceAreaService: ServiceAreaService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getServiceAreas(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.serviceAreaService.getServiceAreas(proProfile.id);
  }

  @Post()
  async addServiceArea(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.serviceAreaService.addServiceArea(proProfile.id, body);
  }

  @Put(':id')
  async updateServiceArea(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.serviceAreaService.updateServiceArea(proProfile.id, id, body);
  }

  @Delete(':id')
  async deleteServiceArea(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.serviceAreaService.deleteServiceArea(proProfile.id, id);
  }

  @Get('calculate-travel-fee')
  calculateTravelFee(@Query('distance') distance: string) {
    const dist = parseFloat(distance);
    const fee = this.serviceAreaService.calculateTravelFee(dist);
    return { distance: dist, travelFee: fee };
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
