import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  async findAll(@Query('proId') proId?: string, @Query('categoryId') categoryId?: string, @Req() req?: any) {
    // Public endpoint - can be called with or without auth
    // If authenticated and no proId specified, get user's own services
    if (req?.user && !proId) {
      try {
        const pro = await this.servicesService.getProByUserId(req.user.userId);
        if (pro) {
          return this.servicesService.findAll(pro.id, categoryId);
        }
      } catch (error) {
        // If error, fall through to public query
      }
    }
    return this.servicesService.findAll(proId, categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyServices(@Req() req, @Query('categoryId') categoryId?: string) {
    // Authenticated endpoint - always returns user's own services
    const pro = await this.servicesService.getProByUserId(req.user.userId);
    if (!pro) {
      throw new Error('Professional profile not found');
    }
    return this.servicesService.findAll(pro.id, categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: CreateServiceDto) {
    // Get proId from authenticated user
    const pro = await this.servicesService.getProByUserId(req.user.userId);
    if (!pro) {
      throw new Error('Professional profile not found');
    }
    return this.servicesService.create(pro.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    return this.servicesService.delete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Req() req, @Body() dto: CreateServiceDto) {
    return this.servicesService.update(id, req.user.userId, dto);
  }
}
