import {
  AlertPriority,
  AlertSource,
  AlertType,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlertsService } from '../alerts.service';
import { CreateAlertDto } from '../dtos/create-alert.dto';

@Injectable()
export class AlertsListener {
  private readonly logger = new Logger(AlertsListener.name);

  constructor(private readonly alertsService: AlertsService) {}

  @OnEvent('alert.create')
  async handleAlertCreateEvent(payload: CreateAlertDto) {
    try {
      this.logger.log(`Received alert.create event: ${payload.title}`);
      await this.alertsService.create(payload);
    } catch (error) {
      this.logger.error('Failed to process alert.create event:', error);
    }
  }

  @OnEvent('error.critical')
  async handleCriticalErrorEvent(payload: {
    title: string;
    message: string;
    stack?: string;
    metadata?: any;
  }) {
    try {
      await this.alertsService.create({
        title: payload.title,
        message: payload.message,
        type: AlertType.ERROR,
        priority: AlertPriority.CRITICAL,
        source: AlertSource.INTERNAL,
        stackTrace: payload.stack,
        metadata: payload.metadata,
      });
    } catch (error) {
      this.logger.error('Failed to process error.critical event:', error);
    }
  }
}
