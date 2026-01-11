import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymService } from '../gym/gym.service';
import { DashboardService } from './dashboard.service';
import { RequestCoachAccessDto } from './dto/request-coach-access.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly gymService: GymService,
  ) {}

  /**
   * Request access to the coach dashboard.
   * Self-certification form submission.
   */
  @Post('request-coach')
  @UseGuards(JwtAuthGuard)
  async requestCoachAccess(
    @Body() dto: RequestCoachAccessDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub;
      const result = await this.dashboardService.requestCoachAccess(
        userId,
        dto,
      );
      return apiResponse(true, undefined, result, result.message);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.USER_UPDATE_FAILED,
        undefined,
        error.message,
      );
    }
  }

  /**
   * Get available dashboards for the current user.
   * Returns which dashboards can be accessed and associated gyms.
   */
  @Get('available')
  @UseGuards(JwtAuthGuard)
  async getAvailableDashboards(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const result = await this.dashboardService.getAvailableDashboards(userId);

      // Get owned gyms for manager dashboard
      if (result.dashboards.includes('manager')) {
        const ownedGymsResponse = await this.gymService.findByOwner(userId);
        result.gymsPerDashboard.manager = ownedGymsResponse.map((gym) => ({
          _id: gym._id.toString(),
          name: gym.name,
        }));
      }

      return apiResponse(
        true,
        undefined,
        result,
        'Available dashboards retrieved',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.INVALID_REQUEST,
        undefined,
        error.message,
      );
    }
  }
}
