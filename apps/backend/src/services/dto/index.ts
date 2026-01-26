import { IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEnum(['HOURLY', 'FIXED', 'INSPECTION'])
  pricingModel: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsString()
  currency: string;
}
