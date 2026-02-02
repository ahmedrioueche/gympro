import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsListener } from './listeners/alerts.listener';
import { Alert, AlertSchema } from './schemas/alert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
    UsersModule,
    CommonModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsListener],
  exports: [AlertsService],
})
export class AlertsModule {}
