import { IsArray, IsOptional, IsString } from 'class-validator';

export class AddAttachmentsDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
