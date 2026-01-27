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
exports.CertificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CertificationsService = class CertificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCertifications(proId) {
        return this.prisma.certification.findMany({
            where: { proId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addCertification(proId, data) {
        return this.prisma.certification.create({
            data: {
                proId,
                ...data,
                status: 'PENDING',
            },
        });
    }
    async updateCertification(proId, certId, data) {
        const cert = await this.prisma.certification.findFirst({
            where: { id: certId, proId },
        });
        if (!cert) {
            throw new common_1.NotFoundException('Certification not found');
        }
        return this.prisma.certification.update({
            where: { id: certId },
            data,
        });
    }
    async deleteCertification(proId, certId) {
        const cert = await this.prisma.certification.findFirst({
            where: { id: certId, proId },
        });
        if (!cert) {
            throw new common_1.NotFoundException('Certification not found');
        }
        await this.prisma.certification.delete({
            where: { id: certId },
        });
        return { success: true };
    }
    async getBadges(proId) {
        return this.prisma.badge.findMany({
            where: { proId },
            orderBy: { earnedAt: 'desc' },
        });
    }
    async awardBadge(proId, badgeType) {
        const badgeConfig = this.getBadgeConfig(badgeType);
        return this.prisma.badge.create({
            data: {
                proId,
                badgeType,
                ...badgeConfig,
            },
        });
    }
    getBadgeConfig(badgeType) {
        const badges = {
            VERIFIED: {
                name: 'Verified Professional',
                description: 'Identity and credentials verified',
                icon: '✓',
            },
            TOP_RATED: {
                name: 'Top Rated',
                description: 'Consistently high ratings',
                icon: '⭐',
            },
            QUICK_RESPONDER: {
                name: 'Quick Responder',
                description: 'Responds within 15 minutes',
                icon: '⚡',
            },
            RELIABLE: {
                name: 'Reliable',
                description: '95%+ completion rate',
                icon: '🎯',
            },
            EXPERIENCED: {
                name: 'Experienced',
                description: '100+ completed jobs',
                icon: '🏆',
            },
        };
        return badges[badgeType] || badges.VERIFIED;
    }
};
exports.CertificationsService = CertificationsService;
exports.CertificationsService = CertificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificationsService);
//# sourceMappingURL=certifications.service.js.map