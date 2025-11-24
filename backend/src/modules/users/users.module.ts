import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { AttendanceRecordSchema } from '../attendace/attendance.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { SubscriptionHistorySchema } from '../gymBilling/gymSubscription/gymSubscription.schema';
import { GymMembershipSchema } from '../gymBilling/membership/membership.schema';
import { BaseNotificationSchema } from '../notifications/notifications.schema';
import {
  ProgramHistorySchema,
  TrainingProgramSchema,
} from '../training/training.schema';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GymModule } from '../gym/gym.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: GymModel.name, schema: GymSchema },
      { name: 'TrainingProgram', schema: TrainingProgramSchema },
      { name: 'AppNotification', schema: BaseNotificationSchema },
      {
        name: 'SubscriptionHistory',
        schema: SubscriptionHistorySchema,
      },
      { name: 'ProgramHistory', schema: ProgramHistorySchema },
      { name: 'AttendanceRecord', schema: AttendanceRecordSchema },
    ]),
    GymModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, PermissionsGuard],
  exports: [UsersService],
})
export class UsersModule { }
