import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  GymManagerFeature,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from '../../common/i18n/i18n.service';
import { User } from '../../common/schemas/user.schema';
import { MailerService } from '../../common/services/mailer.service';
import { GymModel } from '../gym/gym.schema';
import { SmsService } from '../sms/sms.service';

export interface NotificationOptions {
  /**
   * Translation key WITHOUT email/sms prefix (e.g., 'subscription.created')
   * Will automatically resolve to:
   * - email.{key}_subject
   * - email.{key}_body
   * - notification.{key}_body
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
  /** Optional gymId to check for feature permissions */
  gymId?: string;
}

@Injectable()
export class ExternalNotificationService {
  private readonly logger = new Logger(ExternalNotificationService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
    private readonly i18nService: I18nService,
    @InjectModel(GymModel.name)
    private readonly gymModel: Model<GymModel>,
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

    let shouldSendEmail = options.sendEmail !== false;
    let shouldSendSms = options.sendSms !== false;

    // Check gym plan permissions if gymId is provided
    if (options.gymId) {
      const gym = await this.gymModel.findById(options.gymId).lean().exec();
      if (gym) {
        const subscription = gym.appSubscription as any;
        const featurePackages = subscription?.plan?.featurePackages || [];
        const allFeatures: string[] = featurePackages.reduce(
          (acc: string[], pkg: any) => [...acc, ...(pkg.features || [])],
          [],
        );

        const hasEmailFeature = allFeatures.includes(
          GymManagerFeature.EMAIL_NOTIFICATIONS,
        );
        const hasSmsFeature = allFeatures.includes(
          GymManagerFeature.SMS_NOTIFICATIONS,
        );

        if (!hasEmailFeature && shouldSendEmail) {
          this.logger.log(
            `Skipping email: Gym ${gym.name} (${options.gymId}) does not have EMAIL_NOTIFICATIONS feature`,
          );
          shouldSendEmail = false;
        }

        if (!hasSmsFeature && shouldSendSms) {
          this.logger.log(
            `Skipping SMS: Gym ${gym.name} (${options.gymId}) does not have SMS_NOTIFICATIONS feature`,
          );
          shouldSendSms = false;
        }
      }
    }

    // Determine keys to use
    let emailSubjectKey: string;
    let emailBodyKey: string;
    let notificationBodyKey: string;

    if (options.subjectKey && options.messageKey) {
      // Explicit mode - use provided keys directly
      emailSubjectKey = options.subjectKey;
      emailBodyKey = options.messageKey;
      notificationBodyKey = options.messageKey.replace(
        'email.',
        'notification.',
      );
    } else if (options.key) {
      // Convention mode - auto-build keys
      emailSubjectKey = `email.${options.key}_subject`;
      emailBodyKey = `email.${options.key}_body`;
      notificationBodyKey = `notification.${options.key}_body`;
    } else {
      throw new Error(
        'Either "key" or both "subjectKey" and "messageKey" must be provided',
      );
    }

    this.logger.log(
      `Resolving keys: subject=${emailSubjectKey}, body=${emailBodyKey}`,
    );
    this.logger.log(`Language: ${language}`);

    // Send Email
    if (shouldSendEmail) {
      if (user.profile?.email) {
        this.logger.log(`Attempting to send email to ${user.profile.email}...`);
        try {
          const emailSubject = this.i18nService.t(
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
            emailSubject,
            emailBody,
          );
          this.logger.log(
            `✅ Email sent successfully to ${user.profile.email}`,
          );
        } catch (error) {
          this.logger.error(
            `❌ Failed to send email to ${user.profile.email}: ${error.message}`,
          );
        }
      } else {
        this.logger.warn(
          `Skipping email notification: User has no email in profile`,
        );
      }
    }

    // Send SMS
    if (shouldSendSms) {
      if (user.profile?.phoneNumber) {
        this.logger.log(
          `Attempting to send SMS to ${user.profile.phoneNumber}...`,
        );
        try {
          let smsMessage: string;
          if (this.i18nService.exists(notificationBodyKey, language)) {
            smsMessage = this.i18nService.t(
              notificationBodyKey,
              language,
              commonVars,
            );
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
          this.logger.log(
            `✅ SMS sent successfully to ${user.profile.phoneNumber}`,
          );
        } catch (error) {
          this.logger.error(
            `❌ Failed to send SMS to ${user.profile.phoneNumber}: ${error.message}`,
          );
        }
      } else {
        this.logger.warn(
          `Skipping SMS notification: User has no phone number in profile`,
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
