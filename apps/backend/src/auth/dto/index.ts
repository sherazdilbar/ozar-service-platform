import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength,
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  ValidateNested,
  Matches,
  IsPhoneNumber
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  area?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain uppercase, lowercase, number and special character',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens and apostrophes',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens and apostrophes',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phone: string;

  @IsEnum(['CUSTOMER', 'PRO'], {
    message: 'Role must be either CUSTOMER or PRO',
  })
  role: 'CUSTOMER' | 'PRO';

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export * from './password-reset.dto';
