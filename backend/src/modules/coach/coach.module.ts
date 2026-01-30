import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { GymCoachModule } from '../gym-coach/gym-coach.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SessionsModule } from '../sessions/sessions.module';
import { TrainingModule } from '../training/training.module';
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
    forwardRef(() => SessionsModule),
  ],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
