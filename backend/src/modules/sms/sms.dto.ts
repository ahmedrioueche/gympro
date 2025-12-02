import { IsNotEmpty, IsString } from 'class-validator';

export class SendSmsDto {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
