import { IsString, IsEnum, IsOptional, IsNumber, IsArray, MinLength, MaxLength, Min, IsDateString } from 'class-validator';
import { JobUrgency } from '@prisma/client';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(JobUrgency)
  urgency?: JobUrgency;

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
  images?: string[];

  @IsOptional()
  @IsDateString()
  preferredDate?: string;
}
