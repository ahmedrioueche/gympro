import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { PaddleModule } from '../paddle/paddle.module';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionHistoryModel,
  AppSubscriptionHistorySchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from './appBilling.schema';
import { AppFeaturePackageModule } from './featurePackage/feature-package.module';
import { AppPaymentController } from './payment/appPayment.controller';
import { AppPaymentModel, AppPaymentSchema } from './payment/appPayment.schema';
import { AppPaymentService } from './payment/appPayment.service';
import { AppPlansController } from './plan/plan.controller';
import { AppPlansService } from './plan/plan.service';
import { SubscriptionBlockerService } from './subscription/subscription-blocker.service';
import { AppSubscriptionController } from './subscription/subscription.controller';
import { SubscriptionCronService } from './subscription/subscription.cron';
import { AppSubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [
    forwardRef(() => PaddleModule),
    AppFeaturePackageModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AppPlanModel.name, schema: AppPlanSchema },
      { name: AppSubscriptionModel.name, schema: AppSubscriptionSchema },
      {
        name: AppSubscriptionHistoryModel.name,
        schema: AppSubscriptionHistorySchema,
      },
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
      { name: GymModel.name, schema: GymSchema },
    ]),
  ],
  controllers: [
    AppPlansController,
    AppSubscriptionController,
    AppPaymentController,
  ],
  providers: [
    AppPlansService,
    AppSubscriptionService,
    AppPaymentService,
    SubscriptionBlockerService,
    SubscriptionCronService,
  ],
  exports: [
    AppPlansService,
    AppSubscriptionService,
    AppPaymentService,
    SubscriptionBlockerService,
  ],
})
export class AppBillingModule {}
