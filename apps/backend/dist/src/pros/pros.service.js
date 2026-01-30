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
exports.ProsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProsService = class ProsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(dto) {
        console.log('🔍 Finding pros with filters:', dto);
        const { city, district, districts, categoryId, availableNow, radiusKm, lat, lng, query, searchTerm, minPrice, maxPrice, minRating, sortBy = 'rating', sortOrder = 'desc', page = 1, limit = 20 } = dto;
        const where = {
            verificationStatus: 'APPROVED',
        };
        if (city) {
            where.locationCity = city;
            if (city.toLowerCase() === 'budapest') {
                if (district) {
                    where.serviceAreaDistricts = {
                        has: district,
                    };
                    console.log('🏘️  Filtering by Budapest district:', district);
                }
                else if (districts && districts.length > 0) {
                    where.serviceAreaDistricts = {
                        hasSome: districts,
                    };
                    console.log('🏘️  Filtering by Budapest districts:', districts);
                }
                else if (query || searchTerm) {
                    const searchQuery = (query || searchTerm || '').toLowerCase();
                    const districtMatch = searchQuery.match(/(?:district\s+)?([ivx]+)(?:\.|kerület)?/i);
                    if (districtMatch) {
                        const extractedDistrict = districtMatch[1].toUpperCase();
                        where.serviceAreaDistricts = {
                            has: extractedDistrict,
                        };
                        console.log('🏘️  Filtering by Budapest district from query:', extractedDistrict);
                    }
                }
            }
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
            if (minPrice)
                where.startingPrice.gte = minPrice;
            if (maxPrice)
                where.startingPrice.lte = maxPrice;
        }
        if (searchTerm || query) {
            const searchQuery = (searchTerm || query).toLowerCase();
            const categoryMap = {
                'plumb': [client_1.ServiceCategory.PLUMBER, client_1.ServiceCategory.EMERGENCY_PLUMBER],
                'electric': [client_1.ServiceCategory.ELECTRICIAN, client_1.ServiceCategory.EMERGENCY_ELECTRICIAN],
                'handyman': [client_1.ServiceCategory.HANDYMAN],
                'hvac': [client_1.ServiceCategory.HVAC_AC_REPAIR],
                'ac': [client_1.ServiceCategory.HVAC_AC_REPAIR],
                'air': [client_1.ServiceCategory.HVAC_AC_REPAIR],
                'appliance': [client_1.ServiceCategory.APPLIANCE_REPAIR],
                'gas': [client_1.ServiceCategory.GAS_TECHNICIAN],
                'paint': [client_1.ServiceCategory.PAINTING],
                'floor': [client_1.ServiceCategory.FLOORING],
                'tile': [client_1.ServiceCategory.TILE_WORK],
                'kitchen': [client_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING],
                'bathroom': [client_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING],
                'remodel': [client_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING],
                'door': [client_1.ServiceCategory.DOOR_WINDOW_INSTALLATION],
                'window': [client_1.ServiceCategory.DOOR_WINDOW_INSTALLATION],
                'garden': [client_1.ServiceCategory.GARDENING_LAWN_MOWING],
                'lawn': [client_1.ServiceCategory.GARDENING_LAWN_MOWING],
                'tree': [client_1.ServiceCategory.TREE_TRIMMING],
                'fence': [client_1.ServiceCategory.FENCE_INSTALLATION],
                'pressure': [client_1.ServiceCategory.PRESSURE_WASHING],
                'wash': [client_1.ServiceCategory.PRESSURE_WASHING],
                'snow': [client_1.ServiceCategory.SNOW_REMOVAL],
                'clean': [client_1.ServiceCategory.HOME_CLEANING, client_1.ServiceCategory.DEEP_CLEANING, client_1.ServiceCategory.OFFICE_CLEANING],
                'hair': [client_1.ServiceCategory.HAIRCUT, client_1.ServiceCategory.HAIRSTYLIST],
                'barber': [client_1.ServiceCategory.BARBER],
                'beard': [client_1.ServiceCategory.BEARD_GROOMING],
                'nail': [client_1.ServiceCategory.MANICURE_PEDICURE, client_1.ServiceCategory.NAIL_TECHNICIAN],
                'manicure': [client_1.ServiceCategory.MANICURE_PEDICURE],
                'makeup': [client_1.ServiceCategory.MAKEUP_ARTIST],
                'massage': [client_1.ServiceCategory.MASSAGE_THERAPY],
                'physio': [client_1.ServiceCategory.PHYSIOTHERAPY],
                'yoga': [client_1.ServiceCategory.YOGA_INSTRUCTOR],
                'trainer': [client_1.ServiceCategory.PERSONAL_TRAINER, client_1.ServiceCategory.FITNESS_TRAINERS],
                'fitness': [client_1.ServiceCategory.FITNESS_TRAINERS],
                'tv': [client_1.ServiceCategory.TV_MOUNTING],
                'wifi': [client_1.ServiceCategory.WIFI_SETUP],
                'smart': [client_1.ServiceCategory.SMART_HOME_INSTALLATION],
                'cctv': [client_1.ServiceCategory.CCTV_INSTALLATION],
                'computer': [client_1.ServiceCategory.COMPUTER_LAPTOP_REPAIR],
                'laptop': [client_1.ServiceCategory.COMPUTER_LAPTOP_REPAIR],
                'printer': [client_1.ServiceCategory.PRINTER_SETUP],
                'moving': [client_1.ServiceCategory.HOUSE_SHIFTING, client_1.ServiceCategory.FURNITURE_MOVING],
                'delivery': [client_1.ServiceCategory.SMALL_DELIVERIES],
                'packing': [client_1.ServiceCategory.PACKING_UNPACKING],
                'junk': [client_1.ServiceCategory.JUNK_REMOVAL],
                'chef': [client_1.ServiceCategory.COOKING_HOME_CHEF],
                'cook': [client_1.ServiceCategory.COOKING_HOME_CHEF, client_1.ServiceCategory.MEAL_PREP],
                'babysit': [client_1.ServiceCategory.BABYSITTING],
                'elderly': [client_1.ServiceCategory.ELDERLY_CARE],
                'dog': [client_1.ServiceCategory.DOG_WALKING],
                'pet': [client_1.ServiceCategory.PET_SITTING, client_1.ServiceCategory.PET_GROOMING],
                'party': [client_1.ServiceCategory.PARTY_DECORATORS],
                'cater': [client_1.ServiceCategory.CATERERS],
                'dj': [client_1.ServiceCategory.DJS],
                'photo': [client_1.ServiceCategory.PHOTOGRAPHERS],
                'video': [client_1.ServiceCategory.VIDEOGRAPHERS],
                'tutor': [client_1.ServiceCategory.HOME_TUTORS],
                'music': [client_1.ServiceCategory.MUSIC_TEACHERS],
                'language': [client_1.ServiceCategory.LANGUAGE_TUTORS],
                'furniture': [client_1.ServiceCategory.FURNITURE_ASSEMBLY, client_1.ServiceCategory.FURNITURE_MOVING],
                'assembly': [client_1.ServiceCategory.FURNITURE_ASSEMBLY],
                'mount': [client_1.ServiceCategory.MOUNTING_DRILLING, client_1.ServiceCategory.TV_MOUNTING],
                'drill': [client_1.ServiceCategory.MOUNTING_DRILLING],
                'fix': [client_1.ServiceCategory.SMALL_FIXES],
                'emergency': [client_1.ServiceCategory.EMERGENCY_ELECTRICIAN, client_1.ServiceCategory.EMERGENCY_PLUMBER],
            };
            const matchedCategories = [];
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
            if (matchedCategories.length > 0) {
                matchedCategories.forEach(cat => {
                    where.OR.push({ categories: { has: cat } });
                });
            }
        }
        let orderBy = {};
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
                badges: {
                    orderBy: { earnedAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: sortBy !== 'distance' ? orderBy : undefined,
            skip: (page - 1) * limit,
            take: limit,
        });
        if (lat && lng) {
            pros = pros.map((pro) => ({
                ...pro,
                distance: this.calculateDistance(lat, lng, pro.locationLat, pro.locationLng),
            }));
            if (radiusKm) {
                pros = pros.filter((pro) => pro.distance <= radiusKm);
            }
            if (sortBy === 'distance') {
                pros.sort((a, b) => {
                    const order = sortOrder === 'asc' ? 1 : -1;
                    return (a.distance - b.distance) * order;
                });
            }
        }
        const total = await this.prisma.proProfile.count({ where });
        const transformedPros = pros.map((pro) => ({
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
    async findOne(id) {
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
                certifications: {
                    where: { status: 'VERIFIED' },
                    orderBy: { issueDate: 'desc' },
                },
                badges: {
                    orderBy: { earnedAt: 'desc' },
                },
            },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional not found');
        }
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
    async create(userId, dto) {
        console.log('🆕 Creating PRO profile for user:', userId);
        console.log('📋 Profile data:', JSON.stringify(dto, null, 2));
        const result = await this.prisma.proProfile.create({
            data: {
                userId,
                businessName: dto.businessName,
                bio: dto.bio,
                categories: dto.categories,
                serviceAreaCity: dto.serviceArea.city,
                serviceAreaRadius: dto.serviceArea.radiusKm,
                serviceAreaDistricts: [],
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
    async update(id, userId, dto) {
        const pro = await this.prisma.proProfile.findUnique({
            where: { id },
        });
        if (!pro || pro.userId !== userId) {
            throw new common_1.NotFoundException('Professional not found');
        }
        const updateData = {
            businessName: dto.businessName,
            bio: dto.bio,
            categories: dto.categories,
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
    async getReviews(proId, page = 1, limit = 10) {
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
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    async getMyProfile(userId) {
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
            throw new common_1.NotFoundException('Professional profile not found');
        }
        console.log('✅ Profile found with categories:', pro.categories);
        return pro;
    }
    async updateMyProfile(userId, dto) {
        const pro = await this.prisma.proProfile.findUnique({
            where: { userId },
        });
        if (!pro) {
            throw new common_1.NotFoundException('Professional profile not found');
        }
        const updateData = {};
        if (dto.businessName !== undefined)
            updateData.businessName = dto.businessName;
        if (dto.bio !== undefined)
            updateData.bio = dto.bio;
        if (dto.availabilityStatus !== undefined)
            updateData.availabilityStatus = dto.availabilityStatus;
        if (dto.serviceAreaCity !== undefined)
            updateData.serviceAreaCity = dto.serviceAreaCity;
        if (dto.locationCity !== undefined)
            updateData.locationCity = dto.locationCity;
        if (dto.locationDistrict !== undefined)
            updateData.locationDistrict = dto.locationDistrict;
        if (dto.locationArea !== undefined)
            updateData.locationArea = dto.locationArea;
        if (dto.onboardingStep !== undefined)
            updateData.onboardingStep = dto.onboardingStep;
        if (dto.categories !== undefined)
            updateData.categories = dto.categories;
        if (dto.serviceAreaDistricts !== undefined)
            updateData.serviceAreaDistricts = dto.serviceAreaDistricts;
        if (dto.yearsExperience !== undefined)
            updateData.yearsExperience = dto.yearsExperience;
        if (dto.startingPrice !== undefined)
            updateData.startingPrice = dto.startingPrice;
        if (dto.serviceAreaRadius !== undefined)
            updateData.serviceAreaRadius = dto.serviceAreaRadius;
        if (dto.onboardingCompleted !== undefined) {
            updateData.onboardingCompleted = dto.onboardingCompleted;
            if (dto.onboardingCompleted && !pro.onboardingCompletedAt) {
                updateData.onboardingCompletedAt = new Date();
            }
            if (!pro.onboardingStartedAt) {
                updateData.onboardingStartedAt = new Date();
            }
        }
        if (dto.location) {
            updateData.locationCity = dto.location.city;
            updateData.locationArea = dto.location.area;
            updateData.locationLat = dto.location.lat;
            updateData.locationLng = dto.location.lng;
        }
        if (dto.locationLat !== undefined)
            updateData.locationLat = dto.locationLat;
        if (dto.locationLng !== undefined)
            updateData.locationLng = dto.locationLng;
        if (dto.serviceArea) {
            updateData.serviceAreaCity = dto.serviceArea.city;
            updateData.serviceAreaRadius = dto.serviceArea.radiusKm;
        }
        console.log('Update data being saved:', updateData);
        const userUpdateData = {};
        if (dto.phone !== undefined)
            userUpdateData.phone = dto.phone;
        if (dto.avatar !== undefined)
            userUpdateData.avatar = dto.avatar;
        if (Object.keys(userUpdateData).length > 0) {
            await this.prisma.user.update({
                where: { id: userId },
                data: userUpdateData,
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
                locationDistrict: result.locationDistrict,
                locationArea: result.locationArea,
                locationLat: result.locationLat,
                locationLng: result.locationLng,
                serviceAreaCity: result.serviceAreaCity,
                serviceAreaDistricts: result.serviceAreaDistricts,
                serviceAreaRadius: result.serviceAreaRadius,
            });
            const verification = await this.prisma.proProfile.findUnique({
                where: { userId },
                select: {
                    locationCity: true,
                    locationDistrict: true,
                    locationArea: true,
                    locationLat: true,
                    locationLng: true,
                    serviceAreaCity: true,
                    serviceAreaDistricts: true,
                    serviceAreaRadius: true,
                },
            });
            console.log('Verification query result:', verification);
            return result;
        }
        catch (error) {
            console.error('Prisma update error:', error);
            throw error;
        }
    }
    async addPortfolioItem(proId, userId, data) {
        const pro = await this.prisma.proProfile.findUnique({
            where: { id: proId },
        });
        if (!pro || pro.userId !== userId) {
            throw new common_1.NotFoundException('Professional not found');
        }
        return this.prisma.portfolioItem.create({
            data: {
                proId,
                ...data,
            },
        });
    }
    async getPortfolio(proId) {
        return this.prisma.portfolioItem.findMany({
            where: { proId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deletePortfolioItem(itemId, userId) {
        const item = await this.prisma.portfolioItem.findUnique({
            where: { id: itemId },
            include: { pro: true },
        });
        if (!item || item.pro.userId !== userId) {
            throw new common_1.NotFoundException('Portfolio item not found');
        }
        return this.prisma.portfolioItem.delete({
            where: { id: itemId },
        });
    }
    async getOnboardingStatus(userId) {
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
    async updateOnboardingStep(userId, step) {
        const profile = await this.prisma.proProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const updateData = {
            onboardingStep: step,
        };
        if (!profile.onboardingStartedAt) {
            updateData.onboardingStartedAt = new Date();
        }
        await this.prisma.proProfile.update({
            where: { userId },
            data: updateData,
        });
        return { success: true, currentStep: step };
    }
    async completeOnboarding(userId) {
        const profile = await this.prisma.proProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
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
};
exports.ProsService = ProsService;
exports.ProsService = ProsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProsService);
//# sourceMappingURL=pros.service.js.map