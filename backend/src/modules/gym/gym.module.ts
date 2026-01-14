import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { DashboardModule } from '../dashboard/dashboard.module';
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
    ]),
    forwardRef(() => DashboardModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
