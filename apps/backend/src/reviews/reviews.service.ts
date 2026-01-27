import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get reviews for a pro
   */
  async getProReviews(proId: string, page = 1, limit = 10) {
    const reviews = await this.prisma.review.findMany({
      where: { proId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        helpfulVotes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.review.count({ where: { proId } });

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get my reviews (for authenticated pro)
   */
  async getMyReviews(userId: string) {
    // Find pro profile
    const proProfile = await this.prisma.proProfile.findFirst({
      where: { userId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    // Get all reviews for this pro
    const reviews = await this.prisma.review.findMany({
      where: { proId: proProfile.id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        booking: {
          include: {
            service: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: reviews };
  }

  /**
   * Pro responds to a review
   */
  async respondToReview(reviewId: string, userId: string, responseText: string) {
    // Get review and verify pro ownership
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        pro: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.pro.userId !== userId) {
      throw new ForbiddenException('Only the pro can respond to this review');
    }

    // Update review with response (allow updating existing response)
    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        responseText,
        responseAt: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Flag a review for moderation
   */
  async flagReview(reviewId: string, userId: string, reason: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // In a real app, you'd create a flag record and notify admins
    // For now, just return success
    return { success: true, message: 'Review flagged for moderation' };
  }

  /**
   * Toggle helpful vote on a review
   */
  async toggleHelpfulVote(reviewId: string, userId: string) {
    // Check if user already voted
    const existingVote = await this.prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Remove vote
      await this.prisma.reviewHelpfulVote.delete({
        where: { id: existingVote.id },
      });

      // Decrement count
      await this.prisma.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
      });

      return { helpful: false };
    } else {
      // Add vote
      await this.prisma.reviewHelpfulVote.create({
        data: {
          reviewId,
          userId,
        },
      });

      // Increment count
      await this.prisma.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return { helpful: true };
    }
  }

  /**
   * Check if user found review helpful
   */
  async isReviewHelpful(reviewId: string, userId: string) {
    const vote = await this.prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    return { helpful: !!vote };
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        pro: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        helpfulVotes: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
