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
import { TemplatesService } from './templates.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(
    private templatesService: TemplatesService,
    private prisma: PrismaService,
  ) {}

  // Response Templates
  @Get('responses')
  async getResponseTemplates(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.getResponseTemplates(proProfile.id);
  }

  @Post('responses')
  async createResponseTemplate(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.createResponseTemplate(proProfile.id, body);
  }

  @Put('responses/:id')
  async updateResponseTemplate(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.updateResponseTemplate(proProfile.id, id, body);
  }

  @Delete('responses/:id')
  async deleteResponseTemplate(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.deleteResponseTemplate(proProfile.id, id);
  }

  // Auto Responses
  @Get('auto-responses')
  async getAutoResponses(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.getAutoResponses(proProfile.id);
  }

  @Post('auto-responses')
  async createAutoResponse(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.createAutoResponse(proProfile.id, body);
  }

  @Put('auto-responses/:id')
  async updateAutoResponse(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.updateAutoResponse(proProfile.id, id, body);
  }

  @Delete('auto-responses/:id')
  async deleteAutoResponse(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.deleteAutoResponse(proProfile.id, id);
  }

  // Quick Messages
  @Get('quick-messages')
  async getQuickMessages(@Request() req) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.getQuickMessages(proProfile.id);
  }

  @Post('quick-messages')
  async createQuickMessage(@Request() req, @Body() body: any) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.createQuickMessage(proProfile.id, body);
  }

  @Put('quick-messages/:id')
  async updateQuickMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.updateQuickMessage(proProfile.id, id, body);
  }

  @Delete('quick-messages/:id')
  async deleteQuickMessage(@Request() req, @Param('id') id: string) {
    const proProfile = await this.getProProfile(req.user.id);
    return this.templatesService.deleteQuickMessage(proProfile.id, id);
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
