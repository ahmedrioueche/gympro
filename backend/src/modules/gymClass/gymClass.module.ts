import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { GymModule } from '../gym/gym.module';
import { MembershipModule } from '../gymMembership/membership.module';
import {
  SubscriptionTypeModel,
  SubscriptionTypeSchema,
} from '../gymSubscription/gymSubscription.schema';
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
      { name: SubscriptionTypeModel.name, schema: SubscriptionTypeSchema },
    ]),
    SessionsModule,
    NotificationsModule,
    MembershipModule,
    GymModule,
  ],
  controllers: [GymClassController],
  providers: [GymClassService],
  exports: [GymClassService],
})
export class GymClassModule {}
