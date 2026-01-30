import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymCoachPaymentController } from './gym-coach-payment.controller';
import { GymCoachPaymentService } from './gym-coach-payment.service';
import {
  GymCoachPayment,
  GymCoachPaymentSchema,
} from './schemas/gym-coach-payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymCoachPayment.name, schema: GymCoachPaymentSchema },
    ]),
  ],
  controllers: [GymCoachPaymentController],
  providers: [GymCoachPaymentService],
  exports: [GymCoachPaymentService],
})
export class GymCoachPaymentModule {}
