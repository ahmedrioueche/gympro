import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from 'src/common/services/notification.service';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { PaddleModule } from '../paddle/paddle.module';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionHistoryModel,
  AppSubscriptionHistorySchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from './appBilling.schema';
import { AppPlansController } from './plan/plan.controller';
import { AppPlansService } from './plan/plan.service';
import { SubscriptionBlockerService } from './subscription/subscription-blocker.service';
import { AppSubscriptionController } from './subscription/subscription.controller';
import { AppSubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [
    forwardRef(() => PaddleModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AppPlanModel.name, schema: AppPlanSchema },
      { name: AppSubscriptionModel.name, schema: AppSubscriptionSchema },
      {
        name: AppSubscriptionHistoryModel.name,
        schema: AppSubscriptionHistorySchema,
      },
    ]),
  ],
  controllers: [AppPlansController, AppSubscriptionController],
  providers: [
    AppPlansService,
    AppSubscriptionService,
    NotificationService,
    SubscriptionBlockerService,
  ],
  exports: [AppPlansService, AppSubscriptionService],
})
export class AppBillingModule {}
