import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { AppBillingModule } from '../appBilling/appBilling.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import {
  GymCoachAffiliation,
  GymCoachAffiliationSchema,
} from '../gym-coach/schemas/gym-coach-affiliation.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
import { UsersModule } from '../users/users.module';
import { GymController } from './gym.controller';
import { GymSchema } from './gym.schema';
import { GymService } from './gym.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GymModel', schema: GymSchema },
      { name: User.name, schema: UserSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: GymCoachAffiliation.name, schema: GymCoachAffiliationSchema },
    ]),
    forwardRef(() => DashboardModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AppBillingModule),
  ],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
