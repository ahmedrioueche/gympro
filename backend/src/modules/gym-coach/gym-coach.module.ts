import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import {
  CoachRequest,
  CoachRequestSchema,
} from '../coach/schemas/coach-request.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  SessionModel,
  SessionSchema,
} from '../sessions/schemas/session.schema';
import { SessionsModule } from '../sessions/sessions.module';
import { GymCoachController } from './gym-coach.controller';
import { GymCoachService } from './gym-coach.service';
import {
  GymCoachAffiliation,
  GymCoachAffiliationSchema,
} from './schemas/gym-coach-affiliation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymCoachAffiliation.name, schema: GymCoachAffiliationSchema },
      { name: User.name, schema: UserSchema },
      { name: GymModel.name, schema: GymSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: CoachRequest.name, schema: CoachRequestSchema },
      { name: SessionModel.name, schema: SessionSchema },
    ]),
    NotificationsModule,
    forwardRef(() => SessionsModule),
  ],
  controllers: [GymCoachController],
  providers: [GymCoachService],
  exports: [GymCoachService],
})
export class GymCoachModule {}
