import { CreateAnnouncementDto } from '@ahmedrioueche/gympro-client';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGymAnnouncementDto implements CreateAnnouncementDto {
  @IsMongoId()
  @IsNotEmpty()
  gymId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['normal', 'high', 'critical'])
  priority: 'normal' | 'high' | 'critical';

  @IsEnum(['all', 'members', 'staff'])
  targetAudience: 'all' | 'members' | 'staff';

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateGymAnnouncementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['normal', 'high', 'critical'])
  @IsOptional()
  priority?: 'normal' | 'high' | 'critical';

  @IsEnum(['all', 'members', 'staff'])
  @IsOptional()
  targetAudience?: 'all' | 'members' | 'staff';

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
