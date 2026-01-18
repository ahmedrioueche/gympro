import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../common/schemas/user.schema';
import { GymCoachModule } from '../modules/gym-coach/gym-coach.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { TrainingModule } from '../modules/training/training.module';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import {
  CoachRequest,
  CoachRequestSchema,
} from './schemas/coach-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoachRequest.name, schema: CoachRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationsModule,
    GymCoachModule,
    TrainingModule,
  ],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
