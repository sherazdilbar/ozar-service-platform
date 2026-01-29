import { IsString, IsEnum, IsOptional, IsNumber, IsArray, MinLength, MaxLength, Min, Max, IsDateString } from 'class-validator';
import { ServiceCategory, JobUrgency } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  description: string;

  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @IsEnum(JobUrgency)
  urgency: JobUrgency;

  @IsString()
  locationAddr: string;

  @IsString()
  locationCity: string;

  @IsOptional()
  @IsString()
  locationArea?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  locationLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  locationLng: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(10, { each: true })
  images?: string[];

  @IsOptional()
  @IsDateString()
  preferredDate?: string;
}
