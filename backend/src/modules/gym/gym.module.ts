import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { DashboardModule } from '../dashboard/dashboard.module';
import {
  GymMembershipModel,
  GymMembershipSchema,
} from '../gymMembership/membership.schema';
import { GymController } from './gym.controller';
import { GymModel, GymSchema } from './gym.schema';
import { GymService } from './gym.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymModel.name, schema: GymSchema },
      { name: User.name, schema: UserSchema },
      { name: GymMembershipModel.name, schema: GymMembershipSchema },
    ]),
    forwardRef(() => DashboardModule),
  ],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
