import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeolocationService } from 'src/common/services/geolocation.service';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { AppBillingModule } from '../appBilling/appBilling.module';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionHistoryModel,
  AppSubscriptionHistorySchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from '../appBilling/appBilling.schema';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';
import { AttendanceRecordSchema } from '../attendance/attendance.schema';
import { GymModule } from '../gym/gym.module';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { SubscriptionHistorySchema } from '../gymSubscription/gymSubscription.schema';
import { BaseNotificationSchema } from '../notifications/notifications.schema';
import { PaddleService } from '../paddle/paddle.service';
import {
  ProgramHistorySchema,
  TrainingProgramSchema,
} from '../training/training.schema';
import { GymPermissionsGuard } from './guards/gym-permissions.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
      { name: AppPlanModel.name, schema: AppPlanSchema },
      { name: AppSubscriptionModel.name, schema: AppSubscriptionSchema },
      {
        name: AppSubscriptionHistoryModel.name,
        schema: AppSubscriptionHistorySchema,
      },
    ]),

    GymModule,
    forwardRef(() => AppBillingModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    RolesGuard,
    PermissionsGuard,
    GymPermissionsGuard, // Add new guard
    GeolocationService,
    AppSubscriptionService,
    AppPlansService,
    PaddleService,
  ],
  exports: [UsersService, GymPermissionsGuard], // Export for use in other modules
})
export class UsersModule {}
