import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { AppPaymentController } from './payment/appPayment.controller';
import { AppPaymentModel, AppPaymentSchema } from './payment/appPayment.schema';
import { AppPaymentService } from './payment/appPayment.service';
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
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
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
  ],
  exports: [AppPlansService, AppSubscriptionService, AppPaymentService],
})
export class AppBillingModule {}
