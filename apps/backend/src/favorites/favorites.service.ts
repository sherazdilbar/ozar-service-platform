import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(customerId: string, proId: string) {
    // Verify customer exists
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      throw new BadRequestException('Only customers can add favorites');
    }

    // Verify pro exists
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: proId },
    });

    if (!pro) {
      throw new NotFoundException('Professional not found');
    }

    // Check if already favorited
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

    // Create favorite
    const favorite = await this.prisma.favorite.create({
      data: {
        customerId,
        proId,
      },
    });

    return { message: 'Added to favorites', favorite };
  }

  async removeFavorite(customerId: string, proId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        customerId_proId: {
          customerId,
          proId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return { message: 'Removed from favorites' };
  }

  async getFavorites(customerId: string) {
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

  async isFavorite(customerId: string, proId: string) {
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
}
