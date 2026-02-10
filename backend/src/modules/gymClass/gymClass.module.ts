import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { SessionsModule } from '../sessions/sessions.module';
import { GymClassController } from './gymClass.controller';
import { GymClassModel, GymClassSchema } from './gymClass.schema';
import { GymClassService } from './gymClass.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymClassModel.name, schema: GymClassSchema },
      { name: User.name, schema: UserSchema },
    ]),
    SessionsModule,
    NotificationsModule,
  ],
  controllers: [GymClassController],
  providers: [GymClassService],
  exports: [GymClassService],
})
export class GymClassModule {}
