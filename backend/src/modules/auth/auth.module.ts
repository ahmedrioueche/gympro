import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { MailerService } from 'src/common/services/mailer.service';
import { AppBillingModule } from '../appBilling/appBilling.module';
import {
  AppPlanModel,
  AppPlanSchema,
  AppSubscriptionHistoryModel,
  AppSubscriptionHistorySchema,
  AppSubscriptionModel,
  AppSubscriptionSchema,
} from '../appBilling/appBilling.schema';
import { AttendanceRecordSchema } from '../attendace/attendance.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { SubscriptionHistorySchema } from '../gymSubscription/gymSubscription.schema';
import { BaseNotificationSchema } from '../notifications/notifications.schema';
import { SmsModule } from '../sms/sms.module';
import {
  ProgramHistorySchema,
  TrainingProgramSchema,
} from '../training/training.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';

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

    // JWT configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    AppBillingModule,
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService, OtpService],
  exports: [AuthService],
})
export class AuthModule {}
