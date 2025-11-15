import {
  IGoogleAuthDto,
  IGoogleUserDto,
  IRefreshDto,
  IResendVerificationDto,
  ISigninDto,
  ISignupDto,
} from '@ahmedrioueche/gympro-client';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SigninDto implements ISigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class SignupDto implements ISignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  username: string;
}

export class RefreshDto implements IRefreshDto {
  @IsString()
  refreshToken: string;
}

export class ResendVerificationDto implements IResendVerificationDto {
  @IsEmail()
  email: string;
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
