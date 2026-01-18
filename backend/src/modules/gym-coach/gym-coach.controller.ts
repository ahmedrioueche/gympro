import {
  ApiResponse,
  GymCoachAffiliation,
  InviteCoachDto,
  RequestGymAffiliationDto,
  RespondToAffiliationDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymCoachService } from './gym-coach.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class GymCoachController {
  constructor(private readonly gymCoachService: GymCoachService) {}

  /**
   * Get all coaches affiliated with a gym (for gym managers)
   */
  @Get('gyms/:gymId/coaches')
  async getGymCoaches(
    @Param('gymId') gymId: string,
  ): Promise<ApiResponse<GymCoachAffiliation[]>> {
    return this.gymCoachService.getGymCoaches(gymId);
  }

  // Note: getCoachAffiliations has been moved to CoachController to avoid route collision

  /**
   * Gym invites a coach
   */
  @Post('gyms/:gymId/coaches/invite')
  async inviteCoach(
    @Req() req: any,
    @Param('gymId') gymId: string,
    @Body() data: InviteCoachDto,
  ): Promise<ApiResponse<GymCoachAffiliation>> {
    const inviterId = req.user.sub;
    return this.gymCoachService.inviteCoach(
      gymId,
      data.coachId,
      inviterId,
      data,
    );
  }

  /**
   * Coach requests to join a gym
   */
  @Post('gyms/:gymId/coaches/request')
  async requestGymAffiliation(
    @Req() req: any,
    @Param('gymId') gymId: string,
    @Body() data: RequestGymAffiliationDto,
  ): Promise<ApiResponse<GymCoachAffiliation>> {
    const coachId = req.user.sub;
    return this.gymCoachService.requestGymAffiliation(gymId, coachId, data);
  }

  /**
   * Respond to affiliation request
   */
  @Patch('affiliations/:id/respond')
  async respondToAffiliation(
    @Req() req: any,
    @Param('id') affiliationId: string,
    @Body() data: RespondToAffiliationDto,
  ): Promise<ApiResponse<GymCoachAffiliation>> {
    const responderId = req.user.sub;
    return this.gymCoachService.respondToAffiliation(
      affiliationId,
      responderId,
      data.accept,
      data.message,
    );
  }

  /**
   * Terminate affiliation
   */
  @Delete('affiliations/:id')
  async terminateAffiliation(
    @Req() req: any,
    @Param('id') affiliationId: string,
  ): Promise<ApiResponse<void>> {
    const userId = req.user.sub;
    return this.gymCoachService.terminateAffiliation(affiliationId, userId);
  }
}
