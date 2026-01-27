import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProsDto, CreateProDto, UpdateProDto } from './dto';
import { ServiceCategory } from '@prisma/client';

@Injectable()
export class ProsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: GetProsDto) {
    console.log('🔍 Finding pros with filters:', dto);
    
    const { 
      city, 
      categoryId, 
      availableNow, 
      radiusKm, 
      lat, 
      lng, 
      query,
      searchTerm,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1, 
      limit = 20 
    } = dto;

    const where: any = {
      verificationStatus: 'APPROVED',
    };

    if (city) {
      where.locationCity = city;
    }

    if (categoryId) {
      console.log('🏷️  Filtering by category:', categoryId);
      where.categories = {
        has: categoryId,
      };
    }

    if (availableNow) {
      where.availabilityStatus = 'AVAILABLE_NOW';
    }

    if (minRating) {
      where.rating = {
        gte: minRating,
      };
    }

    if (minPrice || maxPrice) {
      where.startingPrice = {};
      if (minPrice) where.startingPrice.gte = minPrice;
      if (maxPrice) where.startingPrice.lte = maxPrice;
    }

    // Smart search across multiple fields
    if (searchTerm || query) {
      const searchQuery = (searchTerm || query).toLowerCase();
      
      // Map common profession terms to categories
      const categoryMap: Record<string, ServiceCategory[]> = {
        'plumb': [ServiceCategory.PLUMBER, ServiceCategory.EMERGENCY_PLUMBER],
        'electric': [ServiceCategory.ELECTRICIAN, ServiceCategory.EMERGENCY_ELECTRICIAN],
        'handyman': [ServiceCategory.HANDYMAN],
        'hvac': [ServiceCategory.HVAC_AC_REPAIR],
        'ac': [ServiceCategory.HVAC_AC_REPAIR],
        'air': [ServiceCategory.HVAC_AC_REPAIR],
        'appliance': [ServiceCategory.APPLIANCE_REPAIR],
        'gas': [ServiceCategory.GAS_TECHNICIAN],
        'paint': [ServiceCategory.PAINTING],
        'floor': [ServiceCategory.FLOORING],
        'tile': [ServiceCategory.TILE_WORK],
        'kitchen': [ServiceCategory.KITCHEN_BATHROOM_REMODELING],
        'bathroom': [ServiceCategory.KITCHEN_BATHROOM_REMODELING],
        'remodel': [ServiceCategory.KITCHEN_BATHROOM_REMODELING],
        'door': [ServiceCategory.DOOR_WINDOW_INSTALLATION],
        'window': [ServiceCategory.DOOR_WINDOW_INSTALLATION],
        'garden': [ServiceCategory.GARDENING_LAWN_MOWING],
        'lawn': [ServiceCategory.GARDENING_LAWN_MOWING],
        'tree': [ServiceCategory.TREE_TRIMMING],
        'fence': [ServiceCategory.FENCE_INSTALLATION],
        'pressure': [ServiceCategory.PRESSURE_WASHING],
        'wash': [ServiceCategory.PRESSURE_WASHING],
        'snow': [ServiceCategory.SNOW_REMOVAL],
        'clean': [ServiceCategory.HOME_CLEANING, ServiceCategory.DEEP_CLEANING, ServiceCategory.OFFICE_CLEANING],
        'hair': [ServiceCategory.HAIRCUT, ServiceCategory.HAIRSTYLIST],
        'barber': [ServiceCategory.BARBER],
        'beard': [ServiceCategory.BEARD_GROOMING],
        'nail': [ServiceCategory.MANICURE_PEDICURE, ServiceCategory.NAIL_TECHNICIAN],
        'manicure': [ServiceCategory.MANICURE_PEDICURE],
        'makeup': [ServiceCategory.MAKEUP_ARTIST],
        'massage': [ServiceCategory.MASSAGE_THERAPY],
        'physio': [ServiceCategory.PHYSIOTHERAPY],
        'yoga': [ServiceCategory.YOGA_INSTRUCTOR],
        'trainer': [ServiceCategory.PERSONAL_TRAINER, ServiceCategory.FITNESS_TRAINERS],
        'fitness': [ServiceCategory.FITNESS_TRAINERS],
        'tv': [ServiceCategory.TV_MOUNTING],
        'wifi': [ServiceCategory.WIFI_SETUP],
        'smart': [ServiceCategory.SMART_HOME_INSTALLATION],
        'cctv': [ServiceCategory.CCTV_INSTALLATION],
        'computer': [ServiceCategory.COMPUTER_LAPTOP_REPAIR],
        'laptop': [ServiceCategory.COMPUTER_LAPTOP_REPAIR],
        'printer': [ServiceCategory.PRINTER_SETUP],
        'moving': [ServiceCategory.HOUSE_SHIFTING, ServiceCategory.FURNITURE_MOVING],
        'delivery': [ServiceCategory.SMALL_DELIVERIES],
        'packing': [ServiceCategory.PACKING_UNPACKING],
        'junk': [ServiceCategory.JUNK_REMOVAL],
        'chef': [ServiceCategory.COOKING_HOME_CHEF],
        'cook': [ServiceCategory.COOKING_HOME_CHEF, ServiceCategory.MEAL_PREP],
        'babysit': [ServiceCategory.BABYSITTING],
        'elderly': [ServiceCategory.ELDERLY_CARE],
        'dog': [ServiceCategory.DOG_WALKING],
        'pet': [ServiceCategory.PET_SITTING, ServiceCategory.PET_GROOMING],
        'party': [ServiceCategory.PARTY_DECORATORS],
        'cater': [ServiceCategory.CATERERS],
        'dj': [ServiceCategory.DJS],
        'photo': [ServiceCategory.PHOTOGRAPHERS],
        'video': [ServiceCategory.VIDEOGRAPHERS],
        'tutor': [ServiceCategory.HOME_TUTORS],
        'music': [ServiceCategory.MUSIC_TEACHERS],
        'language': [ServiceCategory.LANGUAGE_TUTORS],
        'furniture': [ServiceCategory.FURNITURE_ASSEMBLY, ServiceCategory.FURNITURE_MOVING],
        'assembly': [ServiceCategory.FURNITURE_ASSEMBLY],
        'mount': [ServiceCategory.MOUNTING_DRILLING, ServiceCategory.TV_MOUNTING],
        'drill': [ServiceCategory.MOUNTING_DRILLING],
        'fix': [ServiceCategory.SMALL_FIXES],
        'emergency': [ServiceCategory.EMERGENCY_ELECTRICIAN, ServiceCategory.EMERGENCY_PLUMBER],
      };

      // Check if search matches any category
      const matchedCategories: ServiceCategory[] = [];
      for (const [key, categories] of Object.entries(categoryMap)) {
        if (searchQuery.includes(key)) {
          matchedCategories.push(...categories);
        }
      }

      where.OR = [
        { businessName: { contains: searchQuery, mode: 'insensitive' } },
        { bio: { contains: searchQuery, mode: 'insensitive' } },
        { user: { firstName: { contains: searchQuery, mode: 'insensitive' } } },
        { user: { lastName: { contains: searchQuery, mode: 'insensitive' } } },
        { services: { some: { name: { contains: searchQuery, mode: 'insensitive' } } } },
        { services: { some: { description: { contains: searchQuery, mode: 'insensitive' } } } },
      ];

      // Add category matches if found
      if (matchedCategories.length > 0) {
        matchedCategories.forEach(cat => {
          where.OR.push({ categories: { has: cat } });
        });
      }
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      case 'price':
        orderBy = { startingPrice: sortOrder };
        break;
      case 'reviews':
        orderBy = { reviewCount: sortOrder };
        break;
      case 'distance':
        // Distance sorting handled separately below
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    let pros = await this.prisma.proProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        services: true,
        portfolio: true,
      },
      orderBy: sortBy !== 'distance' ? orderBy : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Filter by distance if provided and calculate distance for each pro
    if (lat && lng) {
      pros = pros.map((pro) => ({
        ...pro,
        distance: this.calculateDistance(lat, lng, pro.locationLat, pro.locationLng),
      })) as any[];

      if (radiusKm) {
        pros = pros.filter((pro: any) => pro.distance <= radiusKm);
      }

      // Sort by distance if requested
      if (sortBy === 'distance') {
        pros.sort((a: any, b: any) => {
          const order = sortOrder === 'asc' ? 1 : -1;
          return (a.distance - b.distance) * order;
        });
      }
    }

    const total = await this.prisma.proProfile.count({ where });

    // Transform pros to match ProProfile interface
    const transformedPros = pros.map((pro: any) => ({
      ...pro,
      location: {
        city: pro.locationCity,
        area: pro.locationArea,
        lat: pro.locationLat,
        lng: pro.locationLng,
      },
      serviceArea: {
        city: pro.serviceAreaCity,
        radiusKm: pro.serviceAreaRadius,
      },
    }));

    return {
      data: transformedPros,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const pro = await this.prisma.proProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        services: true,
        portfolio: true,
      },
    });

    if (!pro) {
      throw new NotFoundException('Professional not found');
    }

    // Transform to match ProProfile interface
    return {
      ...pro,
      location: {
        city: pro.locationCity,
        area: pro.locationArea,
        lat: pro.locationLat,
        lng: pro.locationLng,
      },
      serviceArea: {
        city: pro.serviceAreaCity,
        radiusKm: pro.serviceAreaRadius,
      },
    };
  }

  async create(userId: string, dto: CreateProDto) {
    console.log('🆕 Creating PRO profile for user:', userId);
    console.log('📋 Profile data:', JSON.stringify(dto, null, 2));
    
    const result = await this.prisma.proProfile.create({
      data: {
        userId,
        businessName: dto.businessName,
        bio: dto.bio,
        categories: dto.categories as any,
        serviceAreaCity: dto.serviceArea.city,
        serviceAreaRadius: dto.serviceArea.radiusKm,
        locationCity: dto.location.city,
        locationArea: dto.location.area,
        locationLat: dto.location.lat,
        locationLng: dto.location.lng,
      },
      include: {
        user: true,
        services: true,
        portfolio: true,
      },
    });
    
    console.log('✅ PRO profile created with categories:', result.categories);
    return result;
  }

  async update(id: string, userId: string, dto: UpdateProDto) {
    // Verify ownership
    const pro = await this.prisma.proProfile.findUnique({
      where: { id },
    });

    if (!pro || pro.userId !== userId) {
      throw new NotFoundException('Professional not found');
    }

    const updateData: any = {
      businessName: dto.businessName,
      bio: dto.bio,
      categories: dto.categories as any,
    };

    if (dto.availabilityStatus) {
      updateData.availabilityStatus = dto.availabilityStatus;
    }

    if (dto.serviceArea) {
      updateData.serviceAreaCity = dto.serviceArea.city;
      updateData.serviceAreaRadius = dto.serviceArea.radiusKm;
    }

    if (dto.location) {
      updateData.locationCity = dto.location.city;
      updateData.locationArea = dto.location.area;
      updateData.locationLat = dto.location.lat;
      updateData.locationLng = dto.location.lng;
    }

    return this.prisma.proProfile.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        services: true,
        portfolio: true,
      },
    });
  }

  async getReviews(proId: string, page = 1, limit = 10) {
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

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getMyProfile(userId: string) {
    console.log('📖 Getting profile for user:', userId);
    
    const pro = await this.prisma.proProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        services: true,
        portfolio: true,
      },
    });

    if (!pro) {
      throw new NotFoundException('Professional profile not found');
    }

    console.log('✅ Profile found with categories:', pro.categories);
    return pro;
  }

  async updateMyProfile(userId: string, dto: UpdateProDto) {
    const pro = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!pro) {
      throw new NotFoundException('Professional profile not found');
    }

    const updateData: any = {};

    // String fields
    if (dto.businessName !== undefined) updateData.businessName = dto.businessName;
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.availabilityStatus !== undefined) updateData.availabilityStatus = dto.availabilityStatus;
    if (dto.serviceAreaCity !== undefined) updateData.serviceAreaCity = dto.serviceAreaCity;
    if (dto.locationCity !== undefined) updateData.locationCity = dto.locationCity;
    if (dto.locationArea !== undefined) updateData.locationArea = dto.locationArea;
    if (dto.onboardingStep !== undefined) updateData.onboardingStep = dto.onboardingStep;
    
    // Array fields
    if (dto.categories !== undefined) updateData.categories = dto.categories as any;
    
    // Numeric fields (use !== undefined to allow 0 values)
    if (dto.yearsExperience !== undefined) updateData.yearsExperience = dto.yearsExperience;
    if (dto.startingPrice !== undefined) updateData.startingPrice = dto.startingPrice;
    if (dto.serviceAreaRadius !== undefined) updateData.serviceAreaRadius = dto.serviceAreaRadius;
    
    // Boolean fields
    if (dto.onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = dto.onboardingCompleted;
      if (dto.onboardingCompleted && !pro.onboardingCompletedAt) {
        updateData.onboardingCompletedAt = new Date();
      }
      if (!pro.onboardingStartedAt) {
        updateData.onboardingStartedAt = new Date();
      }
    }
    
    // Handle location coordinates from nested object (support both formats)
    if (dto.location) {
      updateData.locationCity = dto.location.city;
      updateData.locationArea = dto.location.area;
      updateData.locationLat = dto.location.lat;
      updateData.locationLng = dto.location.lng;
    }
    // Also support direct lat/lng fields
    if (dto.locationLat !== undefined) updateData.locationLat = dto.locationLat;
    if (dto.locationLng !== undefined) updateData.locationLng = dto.locationLng;

    // Handle service area from nested object
    if (dto.serviceArea) {
      updateData.serviceAreaCity = dto.serviceArea.city;
      updateData.serviceAreaRadius = dto.serviceArea.radiusKm;
    }

    console.log('Update data being saved:', updateData);

    // Update user phone if provided
    if (dto.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { phone: dto.phone },
      });
    }

    try {
      const result = await this.prisma.proProfile.update({
        where: { userId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
              role: true,
              createdAt: true,
            },
          },
          services: true,
          portfolio: true,
        },
      });

      console.log('Updated profile location:', {
        locationCity: result.locationCity,
        locationArea: result.locationArea,
        locationLat: result.locationLat,
        locationLng: result.locationLng,
        serviceAreaCity: result.serviceAreaCity,
        serviceAreaRadius: result.serviceAreaRadius,
      });

      // Verify the update by querying again
      const verification = await this.prisma.proProfile.findUnique({
        where: { userId },
        select: {
          locationCity: true,
          locationArea: true,
          locationLat: true,
          locationLng: true,
          serviceAreaCity: true,
          serviceAreaRadius: true,
        },
      });
      console.log('Verification query result:', verification);

      return result;
    } catch (error) {
      console.error('Prisma update error:', error);
      throw error;
    }
  }

  // Portfolio Management
  async addPortfolioItem(proId: string, userId: string, data: {
    imageUrl: string;
    title: string;
    description: string;
    category: ServiceCategory;
  }) {
    // Verify ownership
    const pro = await this.prisma.proProfile.findUnique({
      where: { id: proId },
    });

    if (!pro || pro.userId !== userId) {
      throw new NotFoundException('Professional not found');
    }

    return this.prisma.portfolioItem.create({
      data: {
        proId,
        ...data,
      },
    });
  }

  async getPortfolio(proId: string) {
    return this.prisma.portfolioItem.findMany({
      where: { proId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deletePortfolioItem(itemId: string, userId: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id: itemId },
      include: { pro: true },
    });

    if (!item || item.pro.userId !== userId) {
      throw new NotFoundException('Portfolio item not found');
    }

    return this.prisma.portfolioItem.delete({
      where: { id: itemId },
    });
  }

  // Onboarding methods
  async getOnboardingStatus(userId: string) {
    const profile = await this.prisma.proProfile.findUnique({
      where: { userId },
      select: {
        onboardingCompleted: true,
        onboardingStep: true,
        onboardingStartedAt: true,
        onboardingCompletedAt: true,
      },
    });

    if (!profile) {
      return {
        completed: false,
        currentStep: null,
        startedAt: null,
        completedAt: null,
      };
    }

    return {
      completed: profile.onboardingCompleted,
      currentStep: profile.onboardingStep,
      startedAt: profile.onboardingStartedAt,
      completedAt: profile.onboardingCompletedAt,
    };
  }

  async updateOnboardingStep(userId: string, step: string) {
    const profile = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const updateData: any = {
      onboardingStep: step,
    };

    // Set startedAt if this is the first step
    if (!profile.onboardingStartedAt) {
      updateData.onboardingStartedAt = new Date();
    }

    await this.prisma.proProfile.update({
      where: { userId },
      data: updateData,
    });

    return { success: true, currentStep: step };
  }

  async completeOnboarding(userId: string) {
    const profile = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.prisma.proProfile.update({
      where: { userId },
      data: {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        onboardingStep: 'complete',
      },
    });

    return { success: true, message: 'Onboarding completed successfully' };
  }
}

