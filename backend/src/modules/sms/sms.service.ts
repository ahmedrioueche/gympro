import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { SendSmsDto, SmsResponse } from './sms.dto';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private vonage: Vonage;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('VONAGE_API_KEY');
    const apiSecret = this.configService.get<string>('VONAGE_API_SECRET');

    if (!apiKey || !apiSecret) {
      this.logger.warn(
        'Vonage API credentials not configured. SMS service will not be available.',
      );
    } else {
      this.vonage = new Vonage({
        apiKey,
        apiSecret,
      });
      this.logger.log('Vonage SMS service initialized successfully');
    }
  }

  /**
   * Send an SMS message using Vonage
   * @param smsData - The SMS data containing to, from, and text
   * @returns Promise with success status and message ID or error
   */
  async sendSMS(smsData: SendSmsDto): Promise<SmsResponse> {
    if (!this.vonage) {
      this.logger.error(
        'Vonage client not initialized. Check API credentials.',
      );
      return {
        success: false,
        error: 'SMS service not configured',
      };
    }

    const { to, from, text } = smsData;

    try {
      this.logger.log(`Sending SMS to ${to}`);

      const response = await this.vonage.sms.send({ to, from, text });

      this.logger.log('Message sent successfully');
      this.logger.debug(`Response: ${JSON.stringify(response)}`);

      return {
        success: true,
        messageId: response.messages[0]['message-id'],
      };
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }

  /**
   * Convenience method to send SMS with individual parameters
   * @param to - Recipient phone number (E.164 format recommended)
   * @param from - Sender name or number
   * @param text - Message text
   * @returns Promise with success status and message ID or error
   */
  async send(to: string, from: string, text: string): Promise<SmsResponse> {
    return this.sendSMS({ to, from, text });
  }
}
