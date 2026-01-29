import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min, IsDateString } from 'class-validator';

export class UpdateBidDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  proposedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  estimatedDuration?: number;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;
}
