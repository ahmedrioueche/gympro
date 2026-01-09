import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import {
  AppPaymentModel,
  AppPaymentSchema,
} from '../appBilling/payment/appPayment.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import {
  GymMembershipModel,
  GymMembershipSchema,
} from '../gymMembership/membership.schema';
import { SubscriptionHistorySchema } from '../gymSubscription/gymSubscription.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymModel.name, schema: GymSchema },
      { name: GymMembershipModel.name, schema: GymMembershipSchema },
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: 'SubscriptionHistory', schema: SubscriptionHistorySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
