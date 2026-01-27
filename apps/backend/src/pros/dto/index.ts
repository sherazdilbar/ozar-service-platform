import {
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetProsDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  availableNow?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radiusKm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lng?: number;

  @IsOptional()
  @IsString()
  query?: string;

  // Smart search & filters
  @IsOptional()
  @IsString()
  searchTerm?: string; // Search by service name, pro name, business name

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsString()
  sortBy?: string; // 'distance' | 'rating' | 'price' | 'reviews'

  @IsOptional()
  @IsString()
  sortOrder?: string; // 'asc' | 'desc'

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

class ServiceAreaDto {
  @IsString()
  city: string;

  @IsNumber()
  radiusKm: number;
}

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  area: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateProDto {
  @IsString()
  businessName: string;

  @IsString()
  bio: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ValidateNested()
  @Type(() => ServiceAreaDto)
  serviceArea: ServiceAreaDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

export class UpdateProDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true})
  categories?: string[];

  @IsOptional()
  @IsString()
  availabilityStatus?: string;

  @IsOptional()
  @IsNumber()
  yearsExperience?: number;

  @IsOptional()
  @IsNumber()
  startingPrice?: number;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @IsOptional()
  @IsString()
  onboardingStep?: string;

  @IsOptional()
  @IsString()
  serviceAreaCity?: string;

  @IsOptional()
  @IsNumber()
  serviceAreaRadius?: number;

  @IsOptional()
  @IsString()
  locationCity?: string;

  @IsOptional()
  @IsString()
  locationArea?: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  // Support nested objects for convenience
  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceAreaDto)
  serviceArea?: ServiceAreaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

export class UpdateOnboardingStepDto {
  @IsString()
  step: string;
}

export class CompleteOnboardingDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
