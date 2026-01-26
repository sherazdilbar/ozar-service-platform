import { Controller, Get, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('pros')
  getPros(
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getPros({ status, city, page, limit });
  }

  @Put('pros/:id/verify')
  verifyPro(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; reason?: string },
  ) {
    return this.adminService.verifyPro(id, body.status, body.reason);
  }

  @Get('bookings')
  getAllBookings(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllBookings({ status, page, limit });
  }

  @Get('disputes')
  getDisputes(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getDisputes({ status, page, limit });
  }

  @Put('disputes/:id/resolve')
  resolveDispute(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { resolution: string; refundAmount?: number },
  ) {
    return this.adminService.resolveDispute(
      id,
      req.user.userId,
      body.resolution,
      body.refundAmount,
    );
  }
}
