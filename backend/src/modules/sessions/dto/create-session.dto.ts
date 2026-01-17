import {
  CreateSessionDto as ICreateSessionDto,
  SessionType,
} from '@ahmedrioueche/gympro-client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSessionDto implements ICreateSessionDto {
  @IsMongoId()
  memberId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

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
}
