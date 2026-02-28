import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppBillingModule } from '../appBilling/appBilling.module';
import { SystemAlertsController } from './system-alerts.controller';
import { SystemAlertSchema } from './system-alerts.schema';
import { SystemAlertsService } from './system-alerts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SystemAlert', schema: SystemAlertSchema },
    ]),
    forwardRef(() => AppBillingModule),
  ],
  controllers: [SystemAlertsController],
  providers: [SystemAlertsService],
  exports: [SystemAlertsService],
})
export class SystemAlertsModule {}
