"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProReviews(proId, page = 1, limit = 10) {
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
    async getMyReviews(userId) {
        const proProfile = await this.prisma.proProfile.findFirst({
            where: { userId },
        });
        if (!proProfile) {
            throw new common_1.NotFoundException('Pro profile not found');
        }
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
    async respondToReview(reviewId, userId, responseText) {
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
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.pro.userId !== userId) {
            throw new common_1.ForbiddenException('Only the pro can respond to this review');
        }
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
    async flagReview(reviewId, userId, reason) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return { success: true, message: 'Review flagged for moderation' };
    }
    async toggleHelpfulVote(reviewId, userId) {
        const existingVote = await this.prisma.reviewHelpfulVote.findUnique({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId,
                },
            },
        });
        if (existingVote) {
            await this.prisma.reviewHelpfulVote.delete({
                where: { id: existingVote.id },
            });
            await this.prisma.review.update({
                where: { id: reviewId },
                data: {
                    helpfulCount: {
                        decrement: 1,
                    },
                },
            });
            return { helpful: false };
        }
        else {
            await this.prisma.reviewHelpfulVote.create({
                data: {
                    reviewId,
                    userId,
                },
            });
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
    async isReviewHelpful(reviewId, userId) {
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
    async getReviewById(reviewId) {
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
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map