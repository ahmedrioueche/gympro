import {
  CreateSessionDto as ICreateSessionDto,
  SessionType,
} from '@ahmedrioueche/gympro-client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateSessionDto implements ICreateSessionDto {
  @IsMongoId()
  memberId: string;

  @IsDateString()
  startTime: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsEnum(SessionType)
  type: SessionType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsMongoId()
  facilityId?: string;

  @IsOptional()
  @IsMongoId()
  gymId?: string;

  @IsOptional()
  @IsObject()
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    endDate?: string | Date;
    days?: number[];
  };
}
