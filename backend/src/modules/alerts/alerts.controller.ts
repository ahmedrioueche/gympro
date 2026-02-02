import {
  AlertPriority,
  AlertSource,
  AlertType,
  APP_PERMISSIONS,
  UpdateAlertStatusDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppPermission } from '../admin/decorators/app-permission.decorator';
import { AppPermissionGuard } from '../admin/guards/app-permission.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlertsService } from './alerts.service';

@Controller('admin/alerts')
@UseGuards(JwtAuthGuard, AppPermissionGuard)
@AppPermission(APP_PERMISSIONS.MANAGE_ALERTS)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll() {
    return {
      success: true,
      data: await this.alertsService.findAll(),
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAlertStatusDto: UpdateAlertStatusDto,
  ) {
    return {
      success: true,
      data: await this.alertsService.updateStatus(
        id,
        updateAlertStatusDto.status,
      ),
    };
  }

  @Post('test')
  async triggerTestAlert() {
    return {
      success: true,
      data: await this.alertsService.create({
        title: 'Manual Test Alert',
        message: 'This is a test alert triggered via /admin/alerts/test',
        type: AlertType.WARNING,
        priority: AlertPriority.HIGH,
        source: AlertSource.INTERNAL,
        metadata: {
          triggeredAt: new Date().toISOString(),
          test: true,
        },
      }),
    };
  }
}
