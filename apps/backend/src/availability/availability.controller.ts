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
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private availabilityService: AvailabilityService,
    private prisma: PrismaService,
  ) {}

  @Get('schedule')
  async getSchedule(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.availabilityService.getSchedule(proProfile.id);
  }

  @Put('schedule')
  async updateSchedule(@Request() req, @Body() body: { schedules: any[] }) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.availabilityService.updateSchedule(proProfile.id, body.schedules);
  }

  @Get('time-off')
  async getTimeOffs(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.availabilityService.getTimeOffs(proProfile.id);
  }

  @Post('time-off')
  async addTimeOff(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.availabilityService.addTimeOff(proProfile.id, body);
  }

  @Delete('time-off/:id')
  async deleteTimeOff(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.availabilityService.deleteTimeOff(proProfile.id, id);
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
