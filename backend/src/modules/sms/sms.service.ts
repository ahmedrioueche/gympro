import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { SendSmsDto, SmsResponse } from './sms.dto';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: Twilio;
  private verifyServiceId: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.verifyServiceId =
      this.configService.get<string>('TWILIO_VERIFY_SERVICE_ID') || '';

    if (!accountSid || !authToken || !this.verifyServiceId) {
      this.logger.warn(
        'Twilio credentials not fully configured. SMS/Verify service will not be available.',
      );
    } else {
      this.client = new Twilio(accountSid, authToken);
      this.logger.log('Twilio service initialized successfully');
    }
  }

  /**
   * Start a verification using Twilio Verify
   * @param to - The phone number to verify
   * @param channel - The channel to use (sms, call, whatsapp)
   * @returns Promise with success status
   */
  async sendVerification(
    to: string,
    channel: 'sms' | 'call' = 'sms',
  ): Promise<SmsResponse> {
    if (!this.client) {
      this.logger.error('Twilio client not initialized.');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      this.logger.log(`Starting verification for ${to} via ${channel}`);
      const verification = await this.client.verify.v2
        .services(this.verifyServiceId)
        .verifications.create({ to, channel });

      this.logger.log(`Verification status: ${verification.status}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error starting Twilio verification:', error);
      return {
        success: false,
        error: error.message || 'Failed to start verification',
      };
    }
  }

  /**
   * Check a verification code using Twilio Verify
   * @param to - The phone number being verified
   * @param code - The code provided by the user
   * @returns Promise with success status
   */
  async checkVerification(to: string, code: string): Promise<SmsResponse> {
    if (!this.client) {
      this.logger.error('Twilio client not initialized.');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      this.logger.log(`Checking verification code for ${to}`);
      const check = await this.client.verify.v2
        .services(this.verifyServiceId)
        .verificationChecks.create({ to, code });

      if (check.status === 'approved') {
        this.logger.log(`Verification approved for ${to}`);
        return { success: true };
      } else {
        this.logger.warn(`Verification ${check.status} for ${to}`);
        return {
          success: false,
          error: `Verification ${check.status}`,
        };
      }
    } catch (error) {
      this.logger.error('Error checking Twilio verification:', error);
      return {
        success: false,
        error: error.message || 'Failed to check verification',
      };
    }
  }

  /**
   * Send a general SMS message using Twilio Messaging
   * @param smsData - The SMS data containing to, from, and text
   * @returns Promise with success status and message ID or error
   */
  async sendSMS(smsData: SendSmsDto): Promise<SmsResponse> {
    if (!this.client) {
      this.logger.error('Twilio client not initialized.');
      return { success: false, error: 'SMS service not configured' };
    }

    let to = smsData.to;
    if (!to.startsWith('+')) {
      to = '+' + to;
    }

    try {
      this.logger.log(`Sending general SMS to ${to}`);
      const message = await this.client.messages.create({
        body: smsData.text,
        to: to,
        from:
          smsData.from || this.configService.get<string>('TWILIO_FROM_NUMBER'),
      });

      this.logger.log(`Message sent successfully: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      this.logger.error('Error sending Twilio SMS:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }

  async send(to: string, from: string, text: string): Promise<SmsResponse> {
    return this.sendSMS({ to, from, text });
  }
}
