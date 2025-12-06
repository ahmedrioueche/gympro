import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../../common/services/mailer.service';
import { buildRedirectUrl, Platform } from '../../common/utils/platform.util';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class MemberInvitationService {
  private readonly logger = new Logger(MemberInvitationService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {}

  async sendMemberInvitation(
    email: string | undefined,
    phoneNumber: string | undefined,
    setupToken: string,
    gymName: string,
    memberName?: string,
    isNewUser: boolean = true,
    platform: Platform = Platform.WEB,
  ) {
    const setupUrl = buildRedirectUrl(platform, '/auth/setup', {
      token: setupToken,
      ...(email && { email }),
      ...(phoneNumber && { phone: phoneNumber }),
    });

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // Send email if provided
    if (email) {
      try {
        const subject = `Welcome to ${gymName}!`;
        const html = `
          <h1>Welcome to ${gymName}!</h1>
          <p>Hi ${memberName || 'there'},</p>
          <p>You've been added as a member to ${gymName}. To get started, please set up your account by clicking the link below:</p>
          <p><a href="${setupUrl}">Set Up Your Account</a></p>
          <p>This link will expire in 7 days.</p>
          <p>If you have any questions, please contact your gym.</p>
        `;

        await this.mailerService.sendMail(email, subject, html);
        results.emailSent = true;
        this.logger.log(`Sent member invitation email to ${email}`);
      } catch (error) {
        this.logger.error(
          `Failed to send member invitation email to ${email}: ${error}`,
        );
        results.errors.push(`Email failed: ${error.message}`);
      }
    }

    // Send SMS if provided
    if (phoneNumber) {
      try {
        const smsText = `Welcome to ${gymName}! You've been added as a member. Set up your account here: ${setupUrl}`;
        const from =
          this.configService.get<string>('VONAGE_FROM_NUMBER') || 'GymPro';

        const result = await this.smsService.send(phoneNumber, from, smsText);

        if (result.success) {
          results.smsSent = true;
          this.logger.log(`Sent member invitation SMS to ${phoneNumber}`);
        } else {
          this.logger.error(
            `Failed to send member invitation SMS to ${phoneNumber}: ${result.error}`,
          );
          results.errors.push(`SMS failed: ${result.error}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to send member invitation SMS to ${phoneNumber}: ${error}`,
        );
        results.errors.push(`SMS failed: ${error.message}`);
      }
    }

    return results;
  }

  async sendExistingUserInvitation(
    email: string | undefined,
    phoneNumber: string | undefined,
    gymName: string,
    memberName?: string,
    platform: Platform = Platform.WEB,
  ) {
    const loginUrl = buildRedirectUrl(platform, '/auth/login', {
      ...(email && { email }),
      ...(phoneNumber && { phone: phoneNumber }),
    });

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // Send email if provided
    if (email) {
      try {
        const subject = `You've been added to ${gymName}!`;
        const html = `
          <h1>Welcome to ${gymName}!</h1>
          <p>Hi ${memberName || 'there'},</p>
          <p>You've been added as a member to ${gymName}. Since you already have an account, you can log in to access your membership:</p>
          <p><a href="${loginUrl}">Log In to Your Account</a></p>
          <p>If you have any questions, please contact your gym.</p>
        `;

        await this.mailerService.sendMail(email, subject, html);
        results.emailSent = true;
        this.logger.log(`Sent existing user invitation email to ${email}`);
      } catch (error) {
        this.logger.error(
          `Failed to send existing user invitation email to ${email}: ${error}`,
        );
        results.errors.push(`Email failed: ${error.message}`);
      }
    }

    // Send SMS if provided
    if (phoneNumber) {
      try {
        const smsText = `You've been added to ${gymName}! Log in to access your membership: ${loginUrl}`;
        const from =
          this.configService.get<string>('VONAGE_FROM_NUMBER') || 'GymPro';

        const result = await this.smsService.send(phoneNumber, from, smsText);

        if (result.success) {
          results.smsSent = true;
          this.logger.log(
            `Sent existing user invitation SMS to ${phoneNumber}`,
          );
        } else {
          this.logger.error(
            `Failed to send existing user invitation SMS to ${phoneNumber}: ${result.error}`,
          );
          results.errors.push(`SMS failed: ${result.error}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to send existing user invitation SMS to ${phoneNumber}: ${error}`,
        );
        results.errors.push(`SMS failed: ${error.message}`);
      }
    }

    return results;
  }
}
