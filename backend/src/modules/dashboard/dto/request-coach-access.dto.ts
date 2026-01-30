import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RequestCoachAccessDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  certificationDetails: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialMediaLinks?: string[];

  @IsOptional()
  @IsArray()
  documents?: {
    url: string;
    description: string;
    type: string;
  }[];
}
