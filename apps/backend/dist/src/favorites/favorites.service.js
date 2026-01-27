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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addFavorite(customerId, proId) {
        const customer = await this.prisma.user.findUnique({
            where: { id: customerId },
        });
        if (!customer || customer.role !== 'CUSTOMER') {
            throw new common_1.BadRequestException('Only customers can add favorites');
        }
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: proId },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional not found');
        }
        const existing = await this.prisma.favorite.findUnique({
            where: {
                customerId_proId: {
                    customerId,
                    proId,
                },
            },
        });
        if (existing) {
            return { message: 'Already in favorites', favorite: existing };
        }
        const favorite = await this.prisma.favorite.create({
            data: {
                customerId,
                proId,
            },
        });
        return { message: 'Added to favorites', favorite };
    }
    async removeFavorite(customerId, proId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: {
                customerId_proId: {
                    customerId,
                    proId,
                },
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite not found');
        }
        await this.prisma.favorite.delete({
            where: {
                id: favorite.id,
            },
        });
        return { message: 'Removed from favorites' };
    }
    async getFavorites(customerId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { customerId },
            include: {
                pro: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                avatar: true,
                            },
                        },
                        services: {
                            take: 3,
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                currency: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return favorites.map(f => f.pro);
    }
    async isFavorite(customerId, proId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: {
                customerId_proId: {
                    customerId,
                    proId,
                },
            },
        });
        return { isFavorite: !!favorite };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map