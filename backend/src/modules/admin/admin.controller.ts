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
@UseGuards(JwtAuthGuard, AdminDashboardGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminStatsService: AdminStatsService,
  ) {}

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.adminStatsService.getDashboardStats();
  }

  @Post('editors')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  createEditor(@Body() dto: CreateEditorDto) {
    return this.adminService.createEditor(dto);
  }

  @Get('editors')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  async getEditors() {
    const editors = await this.adminService.getEditors();
    return { success: true, data: editors };
  }

  @Put('editors/:id/permissions')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  updateEditorPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.adminService.updateEditorPermissions(id, permissions);
  }

  @Delete('editors/:id')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_EDITORS)
  deleteEditor(@Param('id') id: string) {
    return this.adminService.deleteEditor(id);
  }

  // ============================================
  // COACH REQUESTS
  // ============================================

  @Get('coach-requests')
  @UseGuards(AppPermissionGuard)
  // @AppPermission('manage_coach_requests') // TODO: Add permission
  async getCoachRequests() {
    const requests = await this.adminService.getCoachRequests();
    return { success: true, data: requests };
  }

  @Post('coach-requests/:userId/approve')
  @UseGuards(AppPermissionGuard)
  // @AppPermission('manage_coach_requests') // TODO: Add permission
  approveCoachRequest(@Param('userId') userId: string) {
    return this.adminService.approveCoachRequest(userId);
  }

  @Post('coach-requests/:userId/reject')
  @UseGuards(AppPermissionGuard)
  // @AppPermission('manage_coach_requests') // TODO: Add permission
  rejectCoachRequest(@Param('userId') userId: string) {
    return this.adminService.rejectCoachRequest(userId);
  }

  @Get('coaches')
  @UseGuards(AppPermissionGuard)
  // @AppPermission('manage_coaches') // TODO: Add permission
  async getCoaches() {
    const coaches = await this.adminService.getCoaches();
    return { success: true, data: coaches };
  }

  @Get('subscriptions')
  async getSubscriptions() {
    const subscriptions = await this.adminService.getSubscriptions();
    return { success: true, data: subscriptions };
  }

  @Get('payments')
  async getPayments() {
    const payments = await this.adminService.getPayments();
    return { success: true, data: payments };
  }

  @Get('users')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_USERS)
  async getUsers() {
    const users = await this.adminService.getUsers();
    return { success: true, data: users };
  }

  @Put('users/:id/status')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_USERS)
  async toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('gyms')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_GYMS)
  async getGyms() {
    const gyms = await this.adminService.getGyms();
    return { success: true, data: gyms };
  }

  @Put('gyms/:id/status')
  @UseGuards(AppPermissionGuard)
  @AppPermission(APP_PERMISSIONS.MANAGE_GYMS)
  async toggleGymStatus(@Param('id') id: string) {
    return this.adminService.toggleGymStatus(id);
  }
}
