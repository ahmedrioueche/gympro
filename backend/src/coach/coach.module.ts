import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../common/schemas/user.schema';
import { NotificationsModule } from '../modules/notifications/notifications.module';
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
  ],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
