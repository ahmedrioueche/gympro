import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  GymPermissionsGuard,
  RequireGymPermission,
} from '../users/guards/gym-permissions.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  // Global stats aggregates data across all user's gyms - no specific permission check needed
  async getGlobalStats(@Request() req: any) {
    const userId = req.user.sub;
    const stats = await this.analyticsService.getGlobalStats(userId);
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':gymId')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('analytics:view')
  async getGymStats(@Param('gymId') gymId: string) {
    const stats = await this.analyticsService.getGymStats(gymId);
    return {
      success: true,
      data: stats,
    };
  }
}
