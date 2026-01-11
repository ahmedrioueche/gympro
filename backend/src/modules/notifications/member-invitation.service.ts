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

  /**
   * Send invitation to a new staff member to set up their account
   */
  async sendStaffInvitation(
    email: string | undefined,
    phoneNumber: string | undefined,
    setupToken: string,
    gymName: string,
    staffName?: string,
    roleName: string = 'staff',
    platform: Platform = Platform.WEB,
  ) {
    const setupUrl = buildRedirectUrl(platform, '/auth/setup', {
      token: setupToken,
      ...(email && { email }),
      ...(phoneNumber && { phone: phoneNumber }),
    });

    const roleDisplay =
      roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // Send email if provided
    if (email) {
      try {
        const subject = `You've been added as ${roleDisplay} at ${gymName}!`;
        const html = `
          <h1>Welcome to the ${gymName} Team!</h1>
          <p>Hi ${staffName || 'there'},</p>
          <p>Great news! You've been added as a <strong>${roleDisplay}</strong> at ${gymName}.</p>
          <p>To get started with your staff account, please set up your login by clicking the button below:</p>
          <p style="margin: 24px 0;">
            <a href="${setupUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Set Up Your Staff Account
            </a>
          </p>
          <p>This link will expire in 7 days.</p>
          <p>As a ${roleDisplay}, you'll have access to the gym's management dashboard where you can:</p>
          <ul>
            <li>View and manage members</li>
            <li>Track attendance</li>
            <li>Access staff-specific features</li>
          </ul>
          <p>If you have any questions, please contact your gym manager.</p>
          <p>Welcome to the team!</p>
        `;

        await this.mailerService.sendMail(email, subject, html);
        results.emailSent = true;
        this.logger.log(`Sent staff invitation email to ${email}`);
      } catch (error) {
        this.logger.error(
          `Failed to send staff invitation email to ${email}: ${error}`,
        );
        results.errors.push(`Email failed: ${error.message}`);
      }
    }

    // Send SMS if provided
    if (phoneNumber) {
      try {
        const smsText = `Welcome to ${gymName}! You've been added as ${roleDisplay}. Set up your staff account: ${setupUrl}`;
        const from =
          this.configService.get<string>('VONAGE_FROM_NUMBER') || 'GymPro';

        const result = await this.smsService.send(phoneNumber, from, smsText);

        if (result.success) {
          results.smsSent = true;
          this.logger.log(`Sent staff invitation SMS to ${phoneNumber}`);
        } else {
          this.logger.error(
            `Failed to send staff invitation SMS to ${phoneNumber}: ${result.error}`,
          );
          results.errors.push(`SMS failed: ${result.error}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to send staff invitation SMS to ${phoneNumber}: ${error}`,
        );
        results.errors.push(`SMS failed: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Send notification to an existing user who has been added as staff
   */
  async sendExistingUserStaffInvitation(
    email: string | undefined,
    phoneNumber: string | undefined,
    gymName: string,
    staffName?: string,
    roleName: string = 'staff',
    platform: Platform = Platform.WEB,
  ) {
    const loginUrl = buildRedirectUrl(platform, '/auth/login', {
      ...(email && { email }),
      ...(phoneNumber && { phone: phoneNumber }),
    });

    const roleDisplay =
      roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // Send email if provided
    if (email) {
      try {
        const subject = `You've been added as ${roleDisplay} at ${gymName}!`;
        const html = `
          <h1>Welcome to the ${gymName} Team!</h1>
          <p>Hi ${staffName || 'there'},</p>
          <p>Great news! You've been added as a <strong>${roleDisplay}</strong> at ${gymName}.</p>
          <p>Since you already have a GymPro account, you can log in right away to access your new staff dashboard:</p>
          <p style="margin: 24px 0;">
            <a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Log In to Your Account
            </a>
          </p>
          <p>As a ${roleDisplay}, you'll now have access to the gym's management features.</p>
          <p>If you have any questions, please contact your gym manager.</p>
          <p>Welcome to the team!</p>
        `;

        await this.mailerService.sendMail(email, subject, html);
        results.emailSent = true;
        this.logger.log(
          `Sent existing user staff invitation email to ${email}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send existing user staff invitation email to ${email}: ${error}`,
        );
        results.errors.push(`Email failed: ${error.message}`);
      }
    }

    // Send SMS if provided
    if (phoneNumber) {
      try {
        const smsText = `You've been added as ${roleDisplay} at ${gymName}! Log in to access your staff dashboard: ${loginUrl}`;
        const from =
          this.configService.get<string>('VONAGE_FROM_NUMBER') || 'GymPro';

        const result = await this.smsService.send(phoneNumber, from, smsText);

        if (result.success) {
          results.smsSent = true;
          this.logger.log(
            `Sent existing user staff invitation SMS to ${phoneNumber}`,
          );
        } else {
          this.logger.error(
            `Failed to send existing user staff invitation SMS to ${phoneNumber}: ${result.error}`,
          );
          results.errors.push(`SMS failed: ${result.error}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to send existing user staff invitation SMS to ${phoneNumber}: ${error}`,
        );
        results.errors.push(`SMS failed: ${error.message}`);
      }
    }

    return results;
  }
}
