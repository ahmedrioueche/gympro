import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestCoachAccessDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  certificationDetails: string;
}
