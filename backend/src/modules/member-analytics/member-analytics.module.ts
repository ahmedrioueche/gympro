import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { SubscriptionHistorySchema } from '../gym-subscription/gymSubscription.schema';
import { SessionSchema } from '../sessions/schemas/session.schema';
import { MemberAnalyticsController } from './member-analytics.controller';
import { MemberAnalyticsService } from './member-analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SubscriptionHistory', schema: SubscriptionHistorySchema },
      { name: 'Session', schema: SessionSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
    ]),
  ],
  controllers: [MemberAnalyticsController],
  providers: [MemberAnalyticsService],
  exports: [MemberAnalyticsService],
})
export class MemberAnalyticsModule {}
