import { UserRole } from '@ahmedrioueche/gympro-client';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../users/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @Roles(UserRole.Owner, UserRole.Manager)
  async getGlobalStats(@Request() req: any) {
    const userId = req.user.sub;
    const stats = await this.analyticsService.getGlobalStats(userId);
    return {
      success: true,
      data: stats,
    };
  }
}
