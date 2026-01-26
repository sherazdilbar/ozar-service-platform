import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ProsService } from './pros.service';
import { GetProsDto, CreateProDto, UpdateProDto, UpdateOnboardingStepDto, CompleteOnboardingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceCategory } from '@prisma/client';

@Controller('pros')
export class ProsController {
  constructor(private prosService: ProsService) {}

  @Get()
  findAll(@Query() dto: GetProsDto) {
    return this.prosService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateProDto) {
    return this.prosService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateProDto) {
    return this.prosService.update(id, req.user.userId, dto);
  }

  @Get(':id/reviews')
  getReviews(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.prosService.getReviews(id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  getMyProfile(@Req() req) {
    return this.prosService.getMyProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/profile')
  updateMyProfile(@Req() req, @Body() dto: UpdateProDto) {
    return this.prosService.updateMyProfile(req.user.userId, dto);
  }

  // Portfolio endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/portfolio')
  addPortfolioItem(
    @Param('id') id: string,
    @Req() req,
    @Body() data: {
      imageUrl: string;
      title: string;
      description: string;
      category: ServiceCategory;
    },
  ) {
    return this.prosService.addPortfolioItem(id, req.user.userId, data);
  }

  @Get(':id/portfolio')
  getPortfolio(@Param('id') id: string) {
    return this.prosService.getPortfolio(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('portfolio/:itemId')
  deletePortfolioItem(@Param('itemId') itemId: string, @Req() req) {
    return this.prosService.deletePortfolioItem(itemId, req.user.userId);
  }

  // Onboarding endpoints
  @UseGuards(JwtAuthGuard)
  @Get('me/onboarding-status')
  getOnboardingStatus(@Req() req) {
    return this.prosService.getOnboardingStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/onboarding-step')
  updateOnboardingStep(@Req() req, @Body() dto: UpdateOnboardingStepDto) {
    return this.prosService.updateOnboardingStep(req.user.userId, dto.step);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/complete-onboarding')
  completeOnboarding(@Req() req) {
    return this.prosService.completeOnboarding(req.user.userId);
  }
}
