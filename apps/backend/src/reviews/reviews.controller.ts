import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Get reviews for a pro
   */
  @Get('pro/:proId')
  async getProReviews(
    @Param('proId') proId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getProReviews(
      proId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  /**
   * Get my reviews (for authenticated pro)
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  async getMyReviews(@Request() req) {
    return this.reviewsService.getMyReviews(req.user.id);
  }

  /**
   * Get review by ID
   */
  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  /**
   * Pro responds to a review
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/respond')
  async respondToReview(
    @Param('id') id: string,
    @Body('responseText') responseText: string,
    @Request() req,
  ) {
    return this.reviewsService.respondToReview(id, req.user.id, responseText);
  }

  /**
   * Flag a review
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/flag')
  async flagReview(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.reviewsService.flagReview(id, req.user.id, reason);
  }

  /**
   * Toggle helpful vote
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/helpful')
  async toggleHelpfulVote(@Param('id') id: string, @Request() req) {
    return this.reviewsService.toggleHelpfulVote(id, req.user.id);
  }

  /**
   * Check if user found review helpful
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/helpful/check')
  async isReviewHelpful(@Param('id') id: string, @Request() req) {
    return this.reviewsService.isReviewHelpful(id, req.user.id);
  }
}
