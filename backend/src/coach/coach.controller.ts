import {
  ApiResponse,
  CoachProfile,
  CoachQueryDto,
  CoachRequest,
  RequestCoachDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { CoachService } from './coach.service';

@Controller('coaches')
@UseGuards(JwtAuthGuard)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('nearby')
  async getNearbyCoaches(
    @Req() req: any,
    @Query() query: CoachQueryDto,
  ): Promise<ApiResponse<CoachProfile[]>> {
    const userId = req.user.sub;
    return this.coachService.getNearbyCoaches(userId, query);
  }

  @Post(':coachId/request')
  async requestCoach(
    @Req() req: any,
    @Param('coachId') coachId: string,
    @Body() data: RequestCoachDto,
  ): Promise<ApiResponse<CoachRequest>> {
    const memberId = req.user.sub;
    return this.coachService.requestCoach(memberId, coachId, data);
  }

  @Get('requests/my')
  async getMyCoachRequests(
    @Req() req: any,
  ): Promise<ApiResponse<CoachRequest[]>> {
    const memberId = req.user.sub;
    return this.coachService.getMyCoachRequests(memberId);
  }
}
