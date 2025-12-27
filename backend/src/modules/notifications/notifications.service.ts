import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  NotificationPriority,
  NotificationType,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from '../../common/i18n/i18n.service';
import { User } from '../../common/schemas/user.schema';
import {
  ExternalNotificationService,
  NotificationOptions,
} from './external-notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { BaseNotification } from './notifications.schema';

export interface SendNotificationOptions extends NotificationOptions {
  // Core Content overrides
  title?: string;
  message?: string;

  // Metadata
  type?: NotificationType; // Make optional, default to 'alert' if not provided
  priority?: NotificationPriority;
  relatedId?: string; // Generic ID handling (gymId, memberId, etc.)

  // Control Flags
  skipInApp?: boolean;
  skipExternal?: boolean; // Skip both Email/SMS
  // skipEmail, skipSms are in NotificationOptions
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(BaseNotification.name)
    private readonly notificationModel: Model<BaseNotification>,
    private readonly externalService: ExternalNotificationService,
    private readonly i18nService: I18nService,
    private readonly gateway: NotificationsGateway,
  ) {}

  /**
   * Main entry point to send notifications.
   * Compatible with legacy `notifyUser` call signature but enhanced.
   */
  async notifyUser(
    user: User,
    options: SendNotificationOptions,
  ): Promise<void> {
    await this.send(user, options);
  }

  /**
   * Unified send method
   */
  async send(user: User, options: SendNotificationOptions): Promise<void> {
    const language: AppLanguage =
      user.appSettings?.locale?.language || DEFAULT_LANGUAGE;

    // 1. Resolve Content (similar logic to ExternalService but unified here for In-App)
    // We need title/message for In-App.
    // ExternalService does its own resolution, but we can pre-resolve or let it handle it.
    // To ensure consistency, let's resolve here if keys are provided.

    let title = options.title || '';
    let message = options.message || '';

    // If keys provided, resolve for In-App (using generic notification prefix)
    if (options.key) {
      const titleKey =
        options.subjectKey || `notification.${options.key}_title`;
      const bodyKey = options.messageKey || `notification.${options.key}_body`;

      title = await this.resolveContent(language, titleKey, options.vars);
      message = await this.resolveContent(language, bodyKey, options.vars);
    } else if (options.subjectKey && options.messageKey) {
      title = await this.resolveContent(
        language,
        options.subjectKey,
        options.vars,
      );
      message = await this.resolveContent(
        language,
        options.messageKey,
        options.vars,
      );
    }

    // 2. In-App Notification (Default: ON)
    if (!options.skipInApp) {
      this.logger.log('Creating In-App Notification');
      await this.createInAppNotification(user, title, message, options);
    }

    // 3. External Notification (Email or SMS)
    // Delegate to ExternalService
    if (!options.skipExternal) {
      await this.externalService.notifyUser(user, options);
    }
  }

  private async resolveContent(
    lang: AppLanguage,
    key: string,
    vars?: Record<string, string>,
  ): Promise<string> {
    // Helper to add user name vars if missing, matching legacy service
    const commonVars = {
      name: vars?.name || 'User', // Minimal fallback, real user name handled in service if passed user object
      ...vars,
    };
    return this.i18nService.t(key, lang, commonVars);
  }

  private async createInAppNotification(
    user: User,
    title: string,
    message: string,
    options: SendNotificationOptions,
  ) {
    try {
      this.logger.log(
        `Creating notification for user ${user._id} (Role: ${user.role})`,
      );

      let NotificationClass: any = this.notificationModel;
      let roleType = '';

      this.logger.log(`Resolving discriminator for role: ${user.role}`);
      if (!this.notificationModel.discriminators) {
        this.logger.warn(
          'WARNING: discriminators object is undefined on notificationModel',
        );
      }

      switch (user.role) {
        case UserRole.Member:
          NotificationClass =
            this.notificationModel.discriminators?.['MemberNotification'];
          roleType = 'MemberNotification';
          break;
        case UserRole.Coach:
          NotificationClass =
            this.notificationModel.discriminators?.['CoachNotification'];
          roleType = 'CoachNotification';
          break;
        case UserRole.Staff:
          NotificationClass =
            this.notificationModel.discriminators?.['StaffNotification'];
          roleType = 'StaffNotification';
          break;
        case UserRole.Owner:
        case UserRole.Manager:
          NotificationClass =
            this.notificationModel.discriminators?.['OwnerManagerNotification'];
          roleType = 'OwnerManagerNotification';
          break;
      }

      if (!NotificationClass) {
        this.logger.warn(
          `No specific notification class found for role ${user.role}, using Base`,
        );
        NotificationClass = this.notificationModel;
      }

      this.logger.log(
        `Using Notification Class: ${NotificationClass.modelName || NotificationClass.name}`,
      );

      const notificationData: any = {
        userId: user._id.toString(), // Explicit cast to string
        title,
        message,
        type: options.type || 'alert',
        status: 'unread',
        priority: options.priority || 'medium',
        createdAt: new Date().toISOString(),
      };

      this.logger.log(`Notification Data: ${JSON.stringify(notificationData)}`);

      if (options.relatedId) {
        if (roleType === 'MemberNotification') {
          // Could hold programId etc.
          notificationData.relatedProgramId = options.relatedId;
        } else if (roleType === 'OwnerManagerNotification') {
          notificationData.relatedGymId = options.relatedId;
        }
      }

      const notification = new NotificationClass(notificationData);
      const saved = await notification.save();
      this.logger.log(`✅ In-app notification created: ${saved._id}`);

      // ✅ EMIT TO GATEWAY
      this.gateway.sendNotificationToUser(user._id.toString(), saved);
    } catch (error) {
      this.logger.error(
        `❌ Failed to create in-app notification for user ${user._id}`,
        error.stack,
      );
    }
  }
}
