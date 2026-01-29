import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJobDto, UpdateJobDto, CreateBidDto, UpdateBidDto } from './dto';
import { JobStatus, BidStatus, ServiceCategory } from '@prisma/client';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // ==================== JOB ENDPOINTS ====================

  @Post()
  async createJob(@Request() req, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(req.user.userId, dto);
  }

  @Get('my-jobs')
  async getMyJobs(@Request() req, @Query('status') status?: JobStatus) {
    return this.jobsService.findCustomerJobs(req.user.userId, status);
  }

  @Get('available')
  async getAvailableJobs(
    @Request() req,
    @Query('category') category?: ServiceCategory,
  ) {
    // Get pro profile ID
    const user = await this.jobsService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { proProfile: true },
    });

    if (!user?.proProfile) {
      throw new Error('Professional profile not found');
    }

    return this.jobsService.findAvailableJobs(user.proProfile.id, category);
  }

  @Get(':id')
  async getJob(@Request() req, @Param('id') id: string) {
    return this.jobsService.findJobById(id, req.user.userId);
  }

  @Patch(':id')
  async updateJob(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(id, req.user.userId, dto);
  }

  @Post(':id/cancel')
  async cancelJob(@Request() req, @Param('id') id: string) {
    return this.jobsService.cancelJob(id, req.user.userId);
  }

  // ==================== BID ENDPOINTS ====================

  @Post('bids')
  async createBid(@Request() req, @Body() dto: CreateBidDto) {
    // Get pro profile ID
    const user = await this.jobsService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { proProfile: true },
    });

    if (!user?.proProfile) {
      throw new Error('Professional profile not found');
    }

    return this.jobsService.createBid(user.proProfile.id, dto);
  }

  @Get('bids/my-bids')
  async getMyBids(@Request() req, @Query('status') status?: BidStatus) {
    // Get pro profile ID
    const user = await this.jobsService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { proProfile: true },
    });

    if (!user?.proProfile) {
      throw new Error('Professional profile not found');
    }

    return this.jobsService.findProBids(user.proProfile.id, status);
  }

  @Get('bids/:id')
  async getBid(@Request() req, @Param('id') id: string) {
    return this.jobsService.findBidById(id, req.user.userId);
  }

  @Patch('bids/:id')
  async updateBid(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateBidDto,
  ) {
    // Get pro profile ID
    const user = await this.jobsService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { proProfile: true },
    });

    if (!user?.proProfile) {
      throw new Error('Professional profile not found');
    }

    return this.jobsService.updateBid(id, user.proProfile.id, dto);
  }

  @Post('bids/:id/withdraw')
  async withdrawBid(@Request() req, @Param('id') id: string) {
    // Get pro profile ID
    const user = await this.jobsService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { proProfile: true },
    });

    if (!user?.proProfile) {
      throw new Error('Professional profile not found');
    }

    return this.jobsService.withdrawBid(id, user.proProfile.id);
  }

  @Post('bids/:id/accept')
  async acceptBid(@Request() req, @Param('id') id: string) {
    return this.jobsService.acceptBid(id, req.user.userId);
  }

  @Post('bids/:id/reject')
  async rejectBid(@Request() req, @Param('id') id: string) {
    return this.jobsService.rejectBid(id, req.user.userId);
  }
}
