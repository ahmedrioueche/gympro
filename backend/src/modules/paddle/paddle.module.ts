import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppBillingModule } from '../appBilling/appBilling.module';
import { UsersModule } from '../users/users.module';
import { PaddleController } from './paddle.controller';
import { PaddleService } from './paddle.service';

@Module({
  imports: [ConfigModule, AppBillingModule, UsersModule],
  controllers: [PaddleController],
  providers: [PaddleService],
  exports: [PaddleService],
})
export class PaddleModule {}