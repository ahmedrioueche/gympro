import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { GymSchema } from '../gym/gym.schema';
import { UsersModule } from '../users/users.module';
import { CompetitionController } from './competition.controller';
import { CompetitionModel, CompetitionSchema } from './competition.schema';
import { CompetitionService } from './competition.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompetitionModel.name, schema: CompetitionSchema },
      { name: 'GymModel', schema: GymSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
    ]),
    UsersModule,
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {}
