import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerService } from '../../common/services/mailer.service';
import { SmsModule } from '../sms/sms.module';
import { ExternalNotificationService } from './external-notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import {
  BaseNotification,
  BaseNotificationSchema,
  CoachNotification,
  CoachNotificationSchema,
  MemberNotification,
  MemberNotificationSchema,
  OwnerManagerNotification,
  OwnerManagerNotificationSchema,
  StaffNotification,
  StaffNotificationSchema,
} from './notifications.schema';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BaseNotification.name,
        schema: BaseNotificationSchema,
        discriminators: [
          { name: MemberNotification.name, schema: MemberNotificationSchema },
          { name: CoachNotification.name, schema: CoachNotificationSchema },
          { name: StaffNotification.name, schema: StaffNotificationSchema },
          {
            name: OwnerManagerNotification.name,
            schema: OwnerManagerNotificationSchema,
          },
        ],
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, // Consistent with AuthModule
      }),
      inject: [ConfigService],
    }),
    SmsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    MailerService,
    ExternalNotificationService,
    NotificationsGateway,
  ],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
