import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { AppPlanModel, AppSubscriptionModel } from '../appBilling.schema';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  constructor(
    @InjectModel(AppSubscriptionModel.name)
    private readonly subscriptionModel: Model<AppSubscriptionModel>,
    @InjectModel(AppPlanModel.name)
    private readonly planModel: Model<AppPlanModel>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 🔔 Runs every day at 09:00
   * - Warn users before subscription ends
   * - Notify when subscription expired
   * - Notify when downgrade will apply soon
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleSubscriptionsCron() {
    this.logger.log('⏰ Subscription cron started');

    const now = new Date();
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);

    const in1Day = new Date(now);
    in1Day.setDate(in1Day.getDate() + 1);

    await Promise.all([
      this.notifyExpiringSoon(in3Days),
      this.notifyExpiringTomorrow(in1Day),
      this.notifyExpired(now),
      this.notifyPendingDowngrades(in1Day),
    ]);

    this.logger.log('✅ Subscription cron finished');
  }

  /**
   * ⚠️ Expiring in 3 days
   */
  private async notifyExpiringSoon(until: Date) {
    const subs = await this.subscriptionModel
      .find({
        status: 'active',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: { $lte: until },
      })
      .exec();

    for (const sub of subs) {
      const user = await this.userModel.findById(sub.userId);
      if (!user) continue;

      await this.notificationsService.notifyUser(user, {
        key: 'subscription.expiring_soon',
        vars: {
          date: sub.currentPeriodEnd.toLocaleDateString(),
        },
      });

      this.logger.log(`📩 Expiring soon reminder sent → user=${user._id}`);
    }
  }

  /**
   * ⏳ Expiring tomorrow
   */
  private async notifyExpiringTomorrow(until: Date) {
    const subs = await this.subscriptionModel
      .find({
        status: 'active',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: {
          $gte: new Date(until.setHours(0, 0, 0, 0)),
          $lte: new Date(until.setHours(23, 59, 59, 999)),
        },
      })
      .exec();

    for (const sub of subs) {
      const user = await this.userModel.findById(sub.userId);
      if (!user) continue;

      await this.notificationsService.notifyUser(user, {
        key: 'subscription.expiring_tomorrow',
        vars: {
          date: sub.currentPeriodEnd.toLocaleDateString(),
        },
      });

      this.logger.log(`📩 Expiring tomorrow reminder → user=${user._id}`);
    }
  }

  /**
   * ❌ Already expired (manual / non-Paddle safety net)
   */
  private async notifyExpired(now: Date) {
    const subs = await this.subscriptionModel
      .find({
        status: 'active',
        currentPeriodEnd: { $lt: now },
        cancelAtPeriodEnd: true,
      })
      .exec();

    for (const sub of subs) {
      const user = await this.userModel.findById(sub.userId);
      if (!user) continue;

      sub.status = 'cancelled';
      await sub.save();

      await this.notificationsService.notifyUser(user, {
        key: 'subscription.expired',
      });

      this.logger.log(`🛑 Subscription expired → user=${user._id}`);
    }
  }

  /**
   * 📉 Pending downgrade happening tomorrow
   */
  private async notifyPendingDowngrades(until: Date) {
    const subs = await this.subscriptionModel
      .find({
        pendingPlanId: { $exists: true, $ne: null },
        pendingChangeEffectiveDate: { $lte: until },
      })
      .exec();

    for (const sub of subs) {
      const user = await this.userModel.findById(sub.userId);
      if (!user) continue;

      const targetPlan = await this.planModel.findOne({
        planId: sub.pendingPlanId,
      });

      await this.notificationsService.notifyUser(user, {
        key: 'subscription.downgrade_effective_soon',
        vars: {
          planName: targetPlan?.name || 'New plan',
          date: sub.pendingChangeEffectiveDate?.toLocaleDateString() || '',
        },
      });

      this.logger.log(`📉 Downgrade reminder → user=${user._id}`);
    }
  }
}
