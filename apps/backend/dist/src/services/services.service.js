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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(proId, categoryId) {
        const where = {};
        if (proId) {
            where.proId = proId;
        }
        if (categoryId) {
            where.category = categoryId;
        }
        return this.prisma.service.findMany({
            where,
            include: {
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getProByUserId(userId) {
        return this.prisma.proProfile.findUnique({
            where: { userId },
        });
    }
    async create(proId, dto) {
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: proId },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional not found');
        }
        const service = await this.prisma.service.create({
            data: {
                proId,
                name: dto.name,
                description: dto.description,
                category: dto.category,
                pricingModel: dto.pricingModel,
                price: dto.price,
                duration: dto.duration,
                currency: dto.currency,
            },
        });
        await this.updateProPricing(proId);
        return service;
    }
    async delete(serviceId, userId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                pro: true,
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.pro.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own services');
        }
        await this.prisma.service.delete({
            where: { id: serviceId },
        });
        await this.updateProPricing(service.proId);
        return service;
    }
    async update(serviceId, userId, dto) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                pro: true,
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.pro.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own services');
        }
        const updated = await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                name: dto.name,
                description: dto.description,
                category: dto.category,
                pricingModel: dto.pricingModel,
                price: dto.price,
                duration: dto.duration,
                currency: dto.currency,
            },
        });
        await this.updateProPricing(service.proId);
        return updated;
    }
    async toggleStatus(serviceId, userId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                pro: true,
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.pro.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own services');
        }
        const updated = await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                isActive: !service.isActive,
            },
        });
        return updated;
    }
    async updateProPricing(proId) {
        const services = await this.prisma.service.findMany({
            where: { proId },
            orderBy: { price: 'asc' },
        });
        if (services.length > 0) {
            const lowestPriceService = services[0];
            await this.prisma.proProfile.update({
                where: { id: proId },
                data: {
                    startingPrice: lowestPriceService.price,
                    currency: lowestPriceService.currency,
                },
            });
        }
        else {
            await this.prisma.proProfile.update({
                where: { id: proId },
                data: {
                    startingPrice: 0,
                    currency: 'USD',
                },
            });
        }
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map