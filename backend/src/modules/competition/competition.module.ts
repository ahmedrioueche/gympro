import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
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
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {}
