import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post()
  createDispute(
    @Req() req,
    @Body() body: { bookingId: string; reason: string; description: string },
  ) {
    return this.disputesService.createDispute(
      req.user.userId,
      body.bookingId,
      body.reason,
      body.description,
    );
  }

  @Get()
  getUserDisputes(@Req() req) {
    return this.disputesService.getUserDisputes(req.user.userId);
  }

  @Get(':id')
  getDisputeById(@Param('id') id: string, @Req() req) {
    return this.disputesService.getDisputeById(id, req.user.userId);
  }
}
