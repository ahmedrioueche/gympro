import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { GymCoachPaymentModule } from '../gym-coach-payment/gym-coach-payment.module';
import { GymCoachModule } from '../gym-coach/gym-coach.module';
import { SessionModel, SessionSchema } from './schemas/session.schema';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

import { GymMembershipSchema } from '../gymMembership/membership.schema';
import {
  SubscriptionTypeModel,
  SubscriptionTypeSchema,
} from '../gymSubscription/gymSubscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionModel.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: SubscriptionTypeModel.name, schema: SubscriptionTypeSchema },
    ]),
    forwardRef(() => GymCoachModule),
    GymCoachPaymentModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService, MongooseModule],
})
export class SessionsModule {}
