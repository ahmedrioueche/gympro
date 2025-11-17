import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { MailerService } from 'src/common/services/mailer.service';
import { AttendanceRecordSchema } from '../attendace/attendance.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { SubscriptionHistorySchema } from '../gymBilling/gymSubscription/gymSubscription.schema';
import { GymMembershipSchema } from '../gymBilling/membership/membership.schema';
import { BaseNotificationSchema } from '../notifications/notifications.schema';
import {
  ProgramHistorySchema,
  TrainingProgramSchema,
} from '../training/training.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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

    // JWT configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
  exports: [AuthService],
})
export class AuthModule {}
