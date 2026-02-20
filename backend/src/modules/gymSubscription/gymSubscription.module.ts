import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymSchema } from '../gym/gym.schema';
import { UsersModule } from '../users/users.module';
import { GymSubscriptionController } from './gymSubscription.controller';
import {
  SubscriptionTypeModel,
  SubscriptionTypeSchema,
} from './gymSubscription.schema';
import { GymSubscriptionService } from './gymSubscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionTypeModel.name, schema: SubscriptionTypeSchema },
      { name: 'GymModel', schema: GymSchema },
    ]),
    UsersModule,
  ],
  controllers: [GymSubscriptionController],
  providers: [GymSubscriptionService],
  exports: [GymSubscriptionService],
})
export class GymSubscriptionModule {}
