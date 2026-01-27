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
exports.ServiceAreaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServiceAreaService = class ServiceAreaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getServiceAreas(proId) {
        return this.prisma.serviceArea.findMany({
            where: { proId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addServiceArea(proId, data) {
        return this.prisma.serviceArea.create({
            data: {
                proId,
                ...data,
            },
        });
    }
    async updateServiceArea(proId, areaId, data) {
        const area = await this.prisma.serviceArea.findFirst({
            where: { id: areaId, proId },
        });
        if (!area) {
            throw new common_1.NotFoundException('Service area not found');
        }
        return this.prisma.serviceArea.update({
            where: { id: areaId },
            data,
        });
    }
    async deleteServiceArea(proId, areaId) {
        const area = await this.prisma.serviceArea.findFirst({
            where: { id: areaId, proId },
        });
        if (!area) {
            throw new common_1.NotFoundException('Service area not found');
        }
        await this.prisma.serviceArea.delete({
            where: { id: areaId },
        });
        return { success: true };
    }
    calculateTravelFee(distance, baseRate = 500) {
        if (distance <= 5) {
            return 0;
        }
        const extraDistance = distance - 5;
        const perKmRate = baseRate / 10;
        return Math.round(extraDistance * perKmRate);
    }
    async isWithinServiceArea(proId, lat, lng) {
        const areas = await this.prisma.serviceArea.findMany({
            where: { proId, isActive: true },
        });
        for (const area of areas) {
            const distance = this.calculateDistance(lat, lng, 0, 0);
            if (distance <= area.radius) {
                return true;
            }
        }
        return false;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.ServiceAreaService = ServiceAreaService;
exports.ServiceAreaService = ServiceAreaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceAreaService);
//# sourceMappingURL=service-area.service.js.map