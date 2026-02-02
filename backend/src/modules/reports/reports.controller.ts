import {
  APP_PERMISSIONS,
  UpdateReportStatusDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppPermission } from '../admin/decorators/app-permission.decorator';
import { AppPermissionGuard } from '../admin/guards/app-permission.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(req.user.sub, createReportDto);
  }

  @Get('admin')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_REPORTS)
  async findAll() {
    const reports = await this.reportsService.findAll();
    return { success: true, data: reports };
  }

  @Patch('admin/:id/status')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_REPORTS)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
  ) {
    const report = await this.reportsService.updateStatus(
      id,
      updateReportStatusDto,
    );
    return { success: true, data: report };
  }
}
