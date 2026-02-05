import { APP_PERMISSIONS } from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { AdminStatsService } from './admin.stats.service';
import { AppPermission } from './decorators/app-permission.decorator';
import { CreateEditorDto } from './dto/create-editor.dto';
import { AdminDashboardGuard } from './guards/admin-dashboard.guard';
import { AppPermissionGuard } from './guards/app-permission.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminDashboardGuard, AppPermissionGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminStatsService: AdminStatsService,
  ) {}

  @Get('dashboard-stats')
  @AppPermission(APP_PERMISSIONS.VIEW_DASHBOARD)
  getDashboardStats() {
    return this.adminStatsService.getDashboardStats();
  }

  @Post('editors')
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  createEditor(@Body() dto: CreateEditorDto) {
    return this.adminService.createEditor(dto);
  }

  @Get('editors')
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  async getEditors() {
    const editors = await this.adminService.getEditors();
    return { success: true, data: editors };
  }

  @Put('editors/:id/permissions')
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  updateEditorPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.adminService.updateEditorPermissions(id, permissions);
  }

  @Delete('editors/:id')
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  deleteEditor(@Param('id') id: string) {
    return this.adminService.deleteEditor(id);
  }

  // ============================================
  // COACH REQUESTS
  // ============================================

  @Get('coach-requests')
  @AppPermission(APP_PERMISSIONS.MANAGE_COACH_REQUESTS)
  async getCoachRequests() {
    const requests = await this.adminService.getCoachRequests();
    return { success: true, data: requests };
  }

  @Post('coach-requests/:userId/approve')
  @AppPermission(APP_PERMISSIONS.MANAGE_COACH_REQUESTS)
  approveCoachRequest(@Param('userId') userId: string) {
    return this.adminService.approveCoachRequest(userId);
  }

  @Post('coach-requests/:userId/reject')
  @AppPermission(APP_PERMISSIONS.MANAGE_COACH_REQUESTS)
  rejectCoachRequest(@Param('userId') userId: string) {
    return this.adminService.rejectCoachRequest(userId);
  }

  @Get('coaches')
  @AppPermission(APP_PERMISSIONS.MANAGE_COACHES)
  async getCoaches() {
    const coaches = await this.adminService.getCoaches();
    return { success: true, data: coaches };
  }

  @Get('subscriptions')
  @AppPermission(APP_PERMISSIONS.MANAGE_REVENUE)
  async getSubscriptions() {
    const subscriptions = await this.adminService.getSubscriptions();
    return { success: true, data: subscriptions };
  }

  @Get('payments')
  @AppPermission(APP_PERMISSIONS.MANAGE_REVENUE)
  async getPayments() {
    const payments = await this.adminService.getPayments();
    return { success: true, data: payments };
  }

  @Get('users')
  @AppPermission(APP_PERMISSIONS.MANAGE_USERS)
  async getUsers() {
    const users = await this.adminService.getUsers();
    return { success: true, data: users };
  }

  @Put('users/:id/status')
  @AppPermission(APP_PERMISSIONS.MANAGE_USERS)
  async toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('gyms')
  @AppPermission(APP_PERMISSIONS.MANAGE_GYMS)
  async getGyms() {
    const gyms = await this.adminService.getGyms();
    return { success: true, data: gyms };
  }

  @Put('gyms/:id/status')
  @AppPermission(APP_PERMISSIONS.MANAGE_GYMS)
  async toggleGymStatus(@Param('id') id: string) {
    return this.adminService.toggleGymStatus(id);
  }
}
