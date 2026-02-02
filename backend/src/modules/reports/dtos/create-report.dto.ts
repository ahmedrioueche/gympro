import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReportPriority, ReportType } from '../schemas/report.schema';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @IsEnum(ReportPriority)
  @IsOptional()
  priority?: ReportPriority;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
