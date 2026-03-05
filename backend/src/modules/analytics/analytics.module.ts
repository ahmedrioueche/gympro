import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import {
  AppPaymentModel,
  AppPaymentSchema,
} from '../app-billing/payment/appPayment.schema';
import {
  GymCoachAffiliation,
  GymCoachAffiliationSchema,
} from '../gym-coach/schemas/gym-coach-affiliation.schema';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { SubscriptionHistorySchema } from '../gym-subscription/gymSubscription.schema';
import { GymSchema } from '../gym/gym.schema';
import { SessionSchema } from '../sessions/schemas/session.schema';
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
      { name: GymCoachAffiliation.name, schema: GymCoachAffiliationSchema },
      { name: 'Session', schema: SessionSchema },
    ]),
    UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
