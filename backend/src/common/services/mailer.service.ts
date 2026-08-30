import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService implements OnModuleInit {
  private resend: Resend;
  private readonly logger = new Logger(MailerService.name);
  private readonly fromEmail: string;
  private isConfigured: boolean = false;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail =
      this.configService.get<string>('EMAIL_FROM') ||
      'GymPro <onboarding@resend.dev>';

    this.logger.log(
      'Initializing MailerService with Resend (HTTP API - No SMTP)',
    );
    this.logger.log(`RESEND_API_KEY is ${apiKey ? 'SET' : 'NOT SET'}`);
    this.logger.log(`EMAIL_FROM: ${this.fromEmail}`);

    if (!apiKey) {
      this.logger.warn(
        '⚠️ RESEND_API_KEY is not configured - emails will fail',
      );
      this.resend = new Resend('dummy-key');
      this.isConfigured = false;
    } else {
      this.resend = new Resend(apiKey);
      this.isConfigured = true;
    }
  }

  async onModuleInit() {
    if (this.isConfigured) {
      this.logger.log('✅ Email service ready (Resend via HTTPS)');
    } else {
      this.logger.error('❌ Email service not configured - set RESEND_API_KEY');
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    if (!this.isConfigured) {
      this.logger.warn(`⚠️ Skipping email to ${to} - Resend not configured`);
      return;
    }

    try {
      this.logger.log(`📧 Sending email to ${to}: ${subject}`);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
      });

      if (result.error) {
        this.logger.error(
          `❌ Resend API Error sending to ${to}: ${result.error.message} (${result.error.name})`,
        );
        throw new Error(`Resend Error: ${result.error.message}`);
      }

      this.logger.log(
        `✅ Email sent successfully to ${to}: ${result.data?.id || 'unknown'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Failed to send email to ${to}:`,
        error.message || error,
      );
      throw error;
    }
  }
}
