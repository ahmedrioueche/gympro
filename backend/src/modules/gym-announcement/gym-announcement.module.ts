import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipModule } from '../gym-membership/membership.module';
import { GymSchema } from '../gym/gym.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { GymAnnouncementController } from './gym-announcement.controller';
import { GymAnnouncementService } from './gym-announcement.service';
import {
  GymAnnouncementModel,
  GymAnnouncementSchema,
} from './schemas/gym-announcement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymAnnouncementModel.name, schema: GymAnnouncementSchema },
      { name: 'GymModel', schema: GymSchema },
    ]),
    MembershipModule,
    NotificationsModule,
  ],
  controllers: [GymAnnouncementController],
  providers: [GymAnnouncementService],
  exports: [GymAnnouncementService],
})
export class GymAnnouncementModule {}
