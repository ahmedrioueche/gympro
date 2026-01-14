import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import {
  AppPaymentModel,
  AppPaymentSchema,
} from '../appBilling/payment/appPayment.schema';
import { GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { SubscriptionHistorySchema } from '../gymSubscription/gymSubscription.schema';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GymModel', schema: GymSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: 'SubscriptionHistory', schema: SubscriptionHistorySchema },
    ]),
    UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
