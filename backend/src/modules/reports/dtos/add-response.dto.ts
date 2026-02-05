import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
