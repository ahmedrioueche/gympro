import {
  IGoogleAuthDto,
  IGoogleUserDto,
  IRefreshDto,
  IResendVerificationDto,
  ISigninDto,
  ISignupDto,
  IVerifyEmailDto,
  PAYMENT_METHODS,
} from '@ahmedrioueche/gympro-client';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SigninDto implements ISigninDto {
  @IsString()
  identifier: string; // email OR phone number

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class SignupDto implements ISignupDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  username?: string;
}

export class RefreshDto implements IRefreshDto {
  @IsOptional()
  @IsString()
  refreshToken: string;
}

export class ResendVerificationDto implements IResendVerificationDto {
  @IsEmail()
  email: string;
}

export class VerifyEmailDto implements IVerifyEmailDto {
  @IsString()
  token: string;
}

export class GoogleAuthDto implements IGoogleAuthDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class GoogleUserDto implements IGoogleUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;

  @IsString()
  sub: string; // Google's unique identifier
}

// New DTOs for phone authentication
export class SendOtpDto {
  @IsString()
  phoneNumber: string;
}

export class VerifyOtpDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @MinLength(6)
  code: string;
}

export class SetupAccountDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateMemberDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  gymId: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  age?: string;

  // Subscription fields
  @IsOptional()
  @IsString()
  subscriptionTypeId?: string;

  @IsOptional()
  @IsString()
  subscriptionStartDate?: string;

  @IsOptional()
  @IsIn([...PAYMENT_METHODS])
  paymentMethod?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
