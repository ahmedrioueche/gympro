import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { MailerService } from '../../common/services/mailer.service';
import { GymModule } from '../gym/gym.module';
import { MemberInvitationService } from '../notifications/member-invitation.service';
import { SmsModule } from '../sms/sms.module';
import { MembershipController } from './membership.controller';
import { GymMembershipModel, GymMembershipSchema } from './membership.schema';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GymMembershipModel.name, schema: GymMembershipSchema },
    ]),
    SmsModule,
    GymModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService, MemberInvitationService, MailerService],
  exports: [MembershipService],
})
export class MembershipModule {}
