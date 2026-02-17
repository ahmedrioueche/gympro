import {
  ApiResponse,
  MemberDashboardStats,
} from '@ahmedrioueche/gympro-client';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MemberAnalyticsService } from './member-analytics.service';

@Controller('members/analytics')
@UseGuards(JwtAuthGuard)
export class MemberAnalyticsController {
  constructor(
    private readonly memberAnalyticsService: MemberAnalyticsService,
  ) {}

  @Get('dashboard')
  async getDashboardStats(
    @Req() req: any,
  ): Promise<ApiResponse<MemberDashboardStats>> {
    const memberId = req.user.sub;
    return this.memberAnalyticsService.getDashboardStats(memberId);
  }
}
