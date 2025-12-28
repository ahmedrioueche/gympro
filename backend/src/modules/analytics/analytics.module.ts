import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppPaymentModel,
  AppPaymentSchema,
} from '../appBilling/payment/appPayment.schema';
import { GymModel, GymSchema } from '../gym/gym.schema';
import {
  GymMembershipModel,
  GymMembershipSchema,
} from '../gymMembership/membership.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymModel.name, schema: GymSchema },
      { name: GymMembershipModel.name, schema: GymMembershipSchema },
      { name: AppPaymentModel.name, schema: AppPaymentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
