import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateBookingDto {
  @IsString()
  proId: string;

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  scheduledFor?: string;

  @IsBoolean()
  isASAP: boolean;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

export class UpdateBookingStatusDto {
  @IsEnum([
    'DRAFT',
    'REQUESTED',
    'OFFERED',
    'ACCEPTED',
    'PAYMENT_AUTHORIZED',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CAPTURED',
    'CANCELLED_BY_CUSTOMER',
    'CANCELLED_BY_PRO',
    'NO_SHOW',
    'DISPUTED',
    'REFUNDED',
  ])
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class DeclineBookingDto {
  @IsString()
  reason: string;
}
