import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { GymModel, GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { AttendanceController } from './attendance.controller';
import { AttendanceRecordSchema } from './attendance.schema';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AttendanceRecord', schema: AttendanceRecordSchema },
      { name: GymModel.name, schema: GymSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
