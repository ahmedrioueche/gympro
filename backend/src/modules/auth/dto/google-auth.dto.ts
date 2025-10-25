import { IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class GoogleUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;

  @IsString()
  sub: string; // Google's unique identifier
}
