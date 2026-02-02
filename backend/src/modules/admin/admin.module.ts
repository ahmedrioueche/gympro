import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from '../appBilling/appBilling.schema';
import {
  AppPaymentModel,
  AppPaymentSchema,
} from '../appBilling/payment/appPayment.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminStatsService } from './admin.stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GymModel.name, schema: GymSchema },
      { name: AppPlanModel.name, schema: AppPlanSchema },
      { name: AppSubscriptionModel.name, schema: AppSubscriptionSchema },
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminStatsService],
})
export class AdminModule {}
