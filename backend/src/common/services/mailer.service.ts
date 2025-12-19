import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    const host =
      this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const port = Number(this.configService.get<number>('SMTP_PORT')) || 587;
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    this.logger.log(
      `Initializing MailerService with host: ${host}, port: ${port}`,
    );
    this.logger.log(`EMAIL_USER is ${user ? 'SET' : 'NOT SET'}`);
    this.logger.log(`EMAIL_PASS is ${pass ? 'SET' : 'NOT SET'}`);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
    });
  }

  async onModuleInit() {
    this.logger.log('Verifying SMTP connection...');
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('❌ SMTP connection failed:', error.message);
      this.logger.warn(
        'Email sending will likely fail. Check your SMTP credentials and network (port 587/465).',
      );
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM || `"GymPro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
