import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppBillingModule } from '../appBilling/appBilling.module';
import { ChargilyController } from './chargily.controller';
import { ChargilyService } from './chargily.service';

@Module({
  imports: [ConfigModule, AppBillingModule],
  controllers: [ChargilyController],
  providers: [ChargilyService],
  exports: [ChargilyService],
})
export class ChargilyModule {}
