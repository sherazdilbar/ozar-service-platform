import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto, DeclineBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findAll(req.user.userId, req.user.role, status, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.bookingsService.findOne(id, req.user.userId, req.user.role);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Req() req, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, req.user.userId, req.user.role, dto);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Req() req) {
    return this.bookingsService.accept(id, req.user.userId);
  }

  @Post(':id/decline')
  decline(@Param('id') id: string, @Req() req, @Body() dto: DeclineBookingDto) {
    return this.bookingsService.decline(id, req.user.userId, dto.reason);
  }

  @Get('available-slots/:proId')
  getAvailableSlots(
    @Param('proId') proId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ) {
    return this.bookingsService.getAvailableSlots(proId, date, serviceId);
  }

  @Post(':id/start')
  startJob(@Param('id') id: string, @Req() req) {
    return this.bookingsService.startJob(id, req.user.userId);
  }

  @Post(':id/complete')
  completeJob(@Param('id') id: string, @Req() req) {
    return this.bookingsService.completeJob(id, req.user.userId);
  }

  @Post(':id/review')
  createReview(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { rating: number; comment: string },
  ) {
    return this.bookingsService.createReview(
      id,
      req.user.userId,
      body.rating,
      body.comment,
    );
  }
}
