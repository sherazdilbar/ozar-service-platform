import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  proId: string;

  @IsString()
  @IsOptional()
  bookingId?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
