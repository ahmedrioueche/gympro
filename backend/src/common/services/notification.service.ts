import { AppLanguage, DEFAULT_LANGUAGE } from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from '../../modules/sms/sms.service';
import { I18nService } from '../i18n/i18n.service';
import { User } from '../schemas/user.schema';
import { MailerService } from './mailer.service';

export interface NotificationOptions {
  /**
   * Translation key WITHOUT email/sms prefix (e.g., 'subscription.created')
   * Will automatically resolve to:
   * - email.{key}_subject
   * - email.{key}_body
   * - sms.{key}_body
   */
  key?: string;
  /**
   * Override: Explicit subject key (e.g., 'email.subscription.created_subject')
   */
  subjectKey?: string;
  /**
   * Override: Explicit message key (e.g., 'email.subscription.created_body')
   */
  messageKey?: string;
  /** Variables to substitute in the translated text */
  vars?: Record<string, string>;
  /** Send via email (default: true) */
  sendEmail?: boolean;
  /** Send via SMS (default: true) */
  sendSms?: boolean;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Send notification to user via email and/or SMS with i18n support
   */
  async notifyUser(user: User, options: NotificationOptions): Promise<void> {
    const language: AppLanguage =
      user.appSettings?.locale?.language || DEFAULT_LANGUAGE;

    const commonVars = {
      name: user.profile?.fullName || user.profile?.email || 'User',
      ...options.vars,
    };

    const shouldSendEmail = options.sendEmail !== false;
    const shouldSendSms = options.sendSms !== false;

    // Determine keys to use
    let emailSubjectKey: string;
    let emailBodyKey: string;
    let smsBodyKey: string;

    if (options.subjectKey && options.messageKey) {
      // Explicit mode - use provided keys directly
      emailSubjectKey = options.subjectKey;
      emailBodyKey = options.messageKey;
      smsBodyKey = options.messageKey.replace('email.', 'sms.');
    } else if (options.key) {
      // Convention mode - auto-build keys
      emailSubjectKey = `email.${options.key}_subject`;
      emailBodyKey = `email.${options.key}_body`;
      smsBodyKey = `sms.${options.key}_body`;
    } else {
      throw new Error(
        'Either "key" or both "subjectKey" and "messageKey" must be provided',
      );
    }

    this.logger.log(
      `Resolving keys: subject=${emailSubjectKey}, body=${emailBodyKey}`,
    );
    this.logger.log(`Language: ${language}`);
    const subject = this.i18nService.t(emailSubjectKey, language, commonVars);
    this.logger.log(`Resolved subject: ${subject}`);

    // Send Email
    if (shouldSendEmail && user.profile?.email) {
      try {
        const subject = this.i18nService.t(
          emailSubjectKey,
          language,
          commonVars,
        );
        const emailBody = this.i18nService.t(
          emailBodyKey,
          language,
          commonVars,
        );

        await this.mailerService.sendMail(
          user.profile.email,
          subject,
          emailBody,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send email to ${user.profile.email}: ${error}`,
        );
      }
    }

    // Send SMS
    if (shouldSendSms && user.profile?.phoneNumber) {
      try {
        let smsMessage: string;
        if (this.i18nService.exists(smsBodyKey, language)) {
          smsMessage = this.i18nService.t(smsBodyKey, language, commonVars);
        } else {
          // Fallback to email body and strip HTML
          smsMessage = this.i18nService
            .t(emailBodyKey, language, commonVars)
            .replace(/<[^>]*>/g, '')
            .substring(0, 160);
        }

        await this.smsService.send(
          user.profile.phoneNumber,
          'GymPro',
          smsMessage,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send SMS to ${user.profile.phoneNumber}: ${error}`,
        );
      }
    }
  }

  /**
   * Send notification to multiple users
   */
  async notifyUsers(
    users: User[],
    options: NotificationOptions,
  ): Promise<void> {
    await Promise.all(users.map((user) => this.notifyUser(user, options)));
  }
}
