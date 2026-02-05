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
import { AddAttachmentsDto } from './dtos/add-attachments.dto';
import { AddResponseDto } from './dtos/add-response.dto';
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

  @Get('my')
  async findMyReports(@Req() req: any) {
    const reports = await this.reportsService.findByReporter(req.user.sub);
    return { success: true, data: reports };
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

  @Post(':id/response')
  async addResponse(
    @Req() req: any,
    @Param('id') id: string,
    @Body() addResponseDto: AddResponseDto,
  ) {
    const report = await this.reportsService.addResponse(
      id,
      req.user.sub,
      addResponseDto,
    );
    return { success: true, data: report };
  }

  @Post(':id/attachments')
  async addAttachments(
    @Req() req: any,
    @Param('id') id: string,
    @Body() addAttachmentsDto: AddAttachmentsDto,
  ) {
    const report = await this.reportsService.addAttachments(
      id,
      req.user.sub,
      addAttachmentsDto.attachments || [],
    );
    return { success: true, data: report };
  }
}
