import {
  AlertPriority,
  AlertSource,
  AlertType,
} from '@ahmedrioueche/gympro-client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(AlertType)
  type?: AlertType;

  @IsOptional()
  @IsEnum(AlertPriority)
  priority?: AlertPriority;

  @IsOptional()
  @IsEnum(AlertSource)
  source?: AlertSource;

  @IsOptional()
  @IsString()
  stackTrace?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
