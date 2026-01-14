import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { MailerService } from '../../common/services/mailer.service';
import { GymModule } from '../gym/gym.module';
import { GymSchema } from '../gym/gym.schema';
import {
  SubscriptionHistorySchema,
  SubscriptionTypeModel,
  SubscriptionTypeSchema,
} from '../gymSubscription/gymSubscription.schema';
import { MemberInvitationService } from '../notifications/member-invitation.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SmsModule } from '../sms/sms.module';
import { UsersModule } from '../users/users.module';
import { MembershipController } from './membership.controller';
import { GymMembershipSchema } from './membership.schema';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: 'GymModel', schema: GymSchema },
      { name: SubscriptionTypeModel.name, schema: SubscriptionTypeSchema },
      {
        name: 'SubscriptionHistory',
        schema: SubscriptionHistorySchema,
      },
    ]),
    SmsModule,
    GymModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService, MemberInvitationService, MailerService],
  exports: [MembershipService],
})
export class MembershipModule {}
