import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min, IsDateString } from 'class-validator';

export class CreateBidDto {
  @IsString()
  jobId: string;

  @IsNumber()
  @Min(1)
  proposedPrice: number;

  @IsNumber()
  @Min(15)
  estimatedDuration: number; // in minutes

  @IsString()
  @MinLength(20)
  @MaxLength(500)
  message: string;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;
}
