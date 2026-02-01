import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEditorDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  appPermissions?: string[];
}
