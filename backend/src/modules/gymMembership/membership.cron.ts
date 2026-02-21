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
            gymId: gym._id.toString(),
          });
        }

        // Notify Manager
        if (gym.settings?.notifyExpiringMembers !== false) {
          await this.notifyManagers(
            gym,
            user,
            membership._id.toString(),
            'expired',
          );
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
        gymId: gym._id.toString(),
      });

      // Notify Managers (Use existing logic: only for specific types or if they want all?)
      // For now, let's keep manager noise low. Only notify for "Expiring Soon" (Pre-3) and maybe "Expired".
      // We can add granular manager notifications later if requested.
      // Existing logic only handled 'expiring' and 'expired'.
      if (
        (keySuffix === 'membership_expiring_soon' ||
          keySuffix === 'membership_expiring_tomorrow' ||
          keySuffix === 'membership_expiring_today') &&
        gym.settings?.notifyExpiringMembers !== false
      ) {
        let managerNotifType: 'expiring' | 'expired' | 'expiring_today' =
          'expiring';
        if (keySuffix === 'membership_expiring_today') {
          managerNotifType = 'expiring_today';
        }

        await this.notifyManagers(
          gym,
          user,
          membership._id.toString(),
          managerNotifType,
        );
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
    membershipId: string,
    type: 'expiring' | 'expired' | 'expiring_today',
  ) {
    // 1. Get managers from membership collection
    const managersFromMembership = await this.membershipModel
      .find({
        gym: gym._id,
        roles: { $in: [UserRole.Owner, UserRole.Manager] },
        membershipStatus: 'active',
      })
      .populate('user')
      .exec();

    // 2. Identify all users to notify (Owner from Gym model + Managers/Owners from Membership)
    // Map to user ID string for easy deduplication
    const usersMap = new Map<string, User>();

    // Add owner if present on gym model
    if (gym.owner) {
      // In processReminder/handleExpiredStatus we populated or cast gym as GymModel.
      // We need to make sure we have the User object for the owner.
      // If gym.owner is just an ID, we might need to fetch him.
      // But usually it's populated in handleMembershipCron loops if needed.
      // To be safe, let's check if it's a full user object or just an ID.
      let ownerUser: User | null = null;
      if ((gym.owner as any).profile) {
        ownerUser = gym.owner as unknown as User;
      } else {
        ownerUser = await (this.membershipModel.db.model('User') as Model<User>)
          .findById(gym.owner)
          .exec();
      }

      if (ownerUser) {
        usersMap.set(ownerUser._id.toString(), ownerUser);
      }
    }

    // Add others from membership
    for (const m of managersFromMembership) {
      const u = m.user as unknown as User;
      if (u) {
        usersMap.set(u._id.toString(), u);
      }
    }

    for (const manager of usersMap.values()) {
      await this.notificationsService.notifyUser(manager, {
        key: `subscription.manager_member_${type}`,
        vars: {
          memberName: member.profile?.fullName || 'Member',
          gymName: gym.name,
        },
        type: 'subscription' as NotificationType,
        priority: 'low' as NotificationPriority,
        relatedId: member._id.toString(),
        skipExternal: true, // Internal only for managers to avoid spam
        gymId: gym._id.toString(),
        action: {
          type: 'modal',
          payload: 'member_profile',
          data: {
            memberId: member._id.toString(),
            membershipId,
          },
        },
      });
    }
  }
}
