import {
  MembershipStatus,
  NotificationPriority,
  NotificationType,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymModel } from '../gym/gym.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { GymMembershipModel } from './membership.schema';

@Injectable()
export class MembershipCronService {
  private readonly logger = new Logger(MembershipCronService.name);

  constructor(
    @InjectModel('GymMembership')
    private readonly membershipModel: Model<GymMembershipModel>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 🔔 Runs every day at 09:00
   * Checks for various expiration states and sends reminders based on gym settings.
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleMembershipCron() {
    this.logger.log('⏰ Membership cron started');
    const today = new Date();

    // --- Pre-Expiration Reminders ---
    await this.processReminder(
      today,
      3,
      'pre',
      'preExpiry.day3',
      'membership_expiring_soon',
    );
    await this.processReminder(
      today,
      1,
      'pre',
      'preExpiry.day1',
      'membership_expiring_tomorrow',
    );
    await this.processReminder(
      today,
      0,
      'pre',
      'preExpiry.today',
      'membership_expiring_today',
    );

    // --- Expiration Handling (Status Update + "Expired" Notification) ---
    // This is the core "Day 1 Post" logic, effectively.
    await this.handleExpiredStatus(today);

    // --- Post-Expiration Reminders (Win-back) ---
    await this.processReminder(
      today,
      3,
      'post',
      'postExpiry.day3',
      'membership_expired_3d',
    );
    await this.processReminder(
      today,
      7,
      'post',
      'postExpiry.day7',
      'membership_expired_7d',
    );
    await this.processReminder(
      today,
      30,
      'post',
      'postExpiry.day30',
      'membership_expired_30d',
    );
    await this.processReminder(
      today,
      60,
      'post',
      'postExpiry.day60',
      'membership_expired_60d',
    );
    await this.processReminder(
      today,
      90,
      'post',
      'postExpiry.day90',
      'membership_expired_90d',
    );

    this.logger.log('✅ Membership cron finished');
  }

  /**
   * Core Member Status Update Logic
   * Finds active memberships that expired yesterday and marks them as Expired.
   */
  private async handleExpiredStatus(today: Date) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    this.logger.log(`Checking for memberships that expired on ${dateStr}...`);

    const memberships = await this.membershipModel
      .find({ 'subscription.endDate': dateStr })
      .populate('user')
      .populate('gym')
      .exec();

    this.logger.log(
      `Found ${memberships.length} memberships to mark as expired.`,
    );

    for (const membership of memberships) {
      if (membership.membershipStatus !== MembershipStatus.Expired) {
        membership.membershipStatus = MembershipStatus.Expired;
        await membership.save();
      }

      // Send the standard "Expired" notification (no specific toggle for this core alert, or use a default)
      // We can check a general "notifyExpired" setting if desired, but usually this is essential.
      const gym = membership.gym as unknown as GymModel;
      const user = membership.user as unknown as User;

      if (gym && user) {
        // Respect master toggle
        if (gym.settings?.notificationsEnabled !== false) {
          await this.notificationsService.notifyUser(user, {
            key: 'subscription.membership_expired',
            title: 'Membership Expired',
            message: `Your membership at ${gym.name} has expired. Renew now to keep training!`,
            vars: { gymName: gym.name },
            type: 'subscription',
            priority: 'high',
            relatedId: gym._id.toString(),
          });
        }

        // Notify Manager
        if (gym.settings?.notifyExpiringMembers !== false) {
          await this.notifyManagers(gym, user, 'expired');
        }
      }
    }
  }

  /**
   * Generic Reminder Processor
   * @param today Current date
   * @param offsetDays Number of days offset (future for pre, past for post)
   * @param type 'pre' or 'post'
   * @param settingPath Path to the boolean toggle in GymSettings (e.g., 'preExpiry.day3')
   * @param keySuffix Translation key suffix (e.g., 'membership_expiring_soon')
   */
  private async processReminder(
    today: Date,
    offsetDays: number,
    type: 'pre' | 'post',
    settingPath: string,
    keySuffix: string,
  ) {
    const targetDate = new Date(today);
    if (type === 'pre') {
      targetDate.setDate(today.getDate() + offsetDays);
    } else {
      targetDate.setDate(today.getDate() - offsetDays);
    }
    const dateStr = targetDate.toISOString().split('T')[0];

    // For 'pre', we look for ACTIVE memberships expiring on dateStr
    // For 'post', we look for EXPIRED memberships that expired on dateStr
    const query =
      type === 'pre'
        ? { membershipStatus: 'active', 'subscription.endDate': dateStr }
        : {
            membershipStatus: MembershipStatus.Expired,
            'subscription.endDate': dateStr,
          };

    this.logger.log(
      `[${type.toUpperCase()}-${offsetDays}d] Checking date: ${dateStr}`,
    );

    const memberships = await this.membershipModel
      .find(query)
      .populate('user')
      .populate('gym')
      .exec();

    for (const membership of memberships) {
      const gym = membership.gym as unknown as GymModel;
      const user = membership.user as unknown as User;

      if (!gym || !user) continue;

      // Check Notification Settings
      if (!this.isReminderEnabled(gym, settingPath)) {
        continue;
      }

      await this.notificationsService.notifyUser(user, {
        key: `subscription.${keySuffix}`,
        vars: {
          gymName: gym.name,
          date: dateStr,
        },
        type: 'subscription',
        priority: type === 'pre' ? 'high' : 'medium', // Post notices are less urgent
        relatedId: gym._id.toString(),
      });

      // Notify Managers (Use existing logic: only for specific types or if they want all?)
      // For now, let's keep manager noise low. Only notify for "Expiring Soon" (Pre-3) and maybe "Expired".
      // We can add granular manager notifications later if requested.
      // Existing logic only handled 'expiring' and 'expired'.
      if (
        keySuffix === 'membership_expiring_soon' &&
        gym.settings?.notifyExpiringMembers !== false
      ) {
        await this.notifyManagers(gym, user, 'expiring');
      }
    }
  }

  /**
   * Helper to check if a specific reminder is enabled in GymSettings
   */
  private isReminderEnabled(gym: GymModel, settingPath: string): boolean {
    // Default to TRUE if settings is missing
    if (!gym.settings) return true;

    // Respect master toggle
    if (gym.settings.notificationsEnabled === false) return false;

    // Default to TRUE if reminderSettings is missing
    if (!gym.settings.reminderSettings) return true;

    const [category, key] = settingPath.split('.');

    const categoryObj = (gym.settings.reminderSettings as any)[category];
    if (!categoryObj) return true; // Default true if category missing

    return categoryObj[key] !== false; // Default true if key missing, only false if explicitly false
  }

  private async notifyManagers(
    gym: GymModel,
    member: User,
    type: 'expiring' | 'expired' | 'expiring_today',
  ) {
    const managers = await this.membershipModel
      .find({
        gym: gym._id,
        roles: { $in: [UserRole.Owner, UserRole.Manager] },
        membershipStatus: 'active',
      })
      .populate('user')
      .exec();

    for (const managerMembership of managers) {
      const manager = managerMembership.user as unknown as User;
      if (!manager) continue;

      let title = '';
      let message = '';

      switch (type) {
        case 'expiring':
          title = 'Member Expiring Soon';
          message = `${member.profile?.fullName || 'A member'}'s subscription expires in 3 days.`;
          break;
        case 'expiring_today': // Kept for completeness, though not triggered in main loop above currently
          title = 'Member Expires Today';
          message = `${member.profile?.fullName || 'A member'}'s subscription expires today.`;
          break;
        case 'expired':
          title = 'Member Expired';
          message = `${member.profile?.fullName || 'A member'}'s subscription has expired.`;
          break;
      }

      await this.notificationsService.notifyUser(manager, {
        key: `subscription.manager_member_${type}`,
        title,
        message,
        vars: {
          memberName: member.profile?.fullName || 'Member',
          gymName: gym.name,
        },
        type: 'info' as NotificationType,
        priority: 'low' as NotificationPriority,
        relatedId: member._id.toString(),
        skipExternal: true,
        gymId: gym._id.toString(),
      });
    }
  }
}
