import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get pro analytics dashboard
   */
  @Get('pro/dashboard')
  async getProDashboard(
    @Request() req,
    @Query('period') period?: 'week' | 'month' | 'year',
  ) {
    return this.analyticsService.getProAnalytics(
      req.user.userId,
      period || 'month',
    );
  }
}
