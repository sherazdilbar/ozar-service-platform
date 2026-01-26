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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DisputesService = class DisputesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDispute(userId, bookingId, reason, description) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { pro: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId && booking.pro.userId !== userId) {
            throw new common_1.ForbiddenException('You are not part of this booking');
        }
        return this.prisma.dispute.create({
            data: {
                bookingId,
                raisedBy: userId,
                reason,
                description,
            },
            include: {
                booking: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
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
                    },
                },
            },
        });
    }
    async getUserDisputes(userId) {
        return this.prisma.dispute.findMany({
            where: {
                OR: [
                    { raisedBy: userId },
                    { booking: { customerId: userId } },
                    { booking: { pro: { userId } } },
                ],
            },
            include: {
                booking: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
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
                    },
                },
                raisedByUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDisputeById(disputeId, userId) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: {
                booking: {
                    include: {
                        customer: true,
                        pro: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                raisedByUser: true,
                resolver: true,
            },
        });
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        if (dispute.raisedBy !== userId &&
            dispute.booking.customerId !== userId &&
            dispute.booking.pro.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return dispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map