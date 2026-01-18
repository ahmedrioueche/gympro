import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { GymModel as Gym, GymSchema } from '../gym/gym.schema';
import { NotificationsModule } from '../notifications/notifications.module';
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
      { name: Gym.name, schema: GymSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [GymCoachController],
  providers: [GymCoachService],
  exports: [GymCoachService],
})
export class GymCoachModule {}
