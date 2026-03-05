import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GymFeatureGuard } from '../../common/guards/gym-feature.guard';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { AppBillingModule } from '../app-billing/appBilling.module';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionHistoryModel,
  AppSubscriptionHistorySchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from '../app-billing/appBilling.schema';
import { AppPlansService } from '../app-billing/plan/plan.service';
import { AppSubscriptionService } from '../app-billing/subscription/subscription.service';
import { AttendanceRecordSchema } from '../attendance/attendance.schema';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { SubscriptionHistorySchema } from '../gym-subscription/gymSubscription.schema';
import { GymModule } from '../gym/gym.module';
import { GymModel, GymSchema } from '../gym/gym.schema';
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
    GymPermissionsGuard,
    GymFeatureGuard,

    AppSubscriptionService,
    AppPlansService,
    PaddleService,
  ],
  exports: [UsersService, GymPermissionsGuard, GymFeatureGuard, MongooseModule],
})
export class UsersModule {}
