import {
  ApiResponse,
  CoachAnalytics,
  CoachClient,
  CoachProfile,
  CoachQueryDto,
  CoachRequest,
  CoachRequestWithDetails,
  ProspectiveMember,
  ProspectiveMembersQueryDto,
  RequestCoachDto,
  RespondToRequestDto,
  SendCoachRequestDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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

  // ============================================
  // SPECIFIC ROUTES (must come before :coachId)
  // ============================================

  @Get('analytics')
  async getAnalytics(@Req() req: any): Promise<ApiResponse<CoachAnalytics>> {
    const coachId = req.user.sub;
    return this.coachService.getAnalytics(coachId);
  }

  @Get('nearby')
  async getNearbyCoaches(
    @Req() req: any,
    @Query() query: CoachQueryDto,
  ): Promise<ApiResponse<CoachProfile[]>> {
    const userId = req.user.sub;
    return this.coachService.getNearbyCoaches(userId, query);
  }

  @Get('requests/my')
  async getMyCoachRequests(
    @Req() req: any,
  ): Promise<ApiResponse<CoachRequest[]>> {
    const memberId = req.user.sub;
    return this.coachService.getMyCoachRequests(memberId);
  }

  @Get('requests/pending')
  async getPendingRequests(
    @Req() req: any,
  ): Promise<ApiResponse<CoachRequestWithDetails[]>> {
    const coachId = req.user.sub;
    return this.coachService.getPendingRequests(coachId);
  }

  @Patch('requests/:requestId/respond')
  async respondToRequest(
    @Req() req: any,
    @Param('requestId') requestId: string,
    @Body() data: RespondToRequestDto,
  ): Promise<ApiResponse<CoachRequest>> {
    const coachId = req.user.sub;
    return this.coachService.respondToRequest(coachId, requestId, data);
  }

  @Get('clients')
  async getActiveClients(@Req() req: any): Promise<ApiResponse<CoachClient[]>> {
    const coachId = req.user.sub;
    return this.coachService.getActiveClients(coachId);
  }

  @Get('prospective-members')
  async getProspectiveMembers(
    @Req() req: any,
    @Query() query: ProspectiveMembersQueryDto,
  ): Promise<ApiResponse<ProspectiveMember[]>> {
    const coachId = req.user.sub;
    return this.coachService.getProspectiveMembers(coachId, query);
  }

  // ============================================
  // PARAMETERIZED ROUTES (must come after specific routes)
  // ============================================

  @Get(':coachId')
  async getCoachProfile(
    @Param('coachId') coachId: string,
  ): Promise<ApiResponse<CoachProfile>> {
    return this.coachService.getCoachProfile(coachId);
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

  @Post('members/:memberId/request')
  async sendRequestToMember(
    @Req() req: any,
    @Param('memberId') memberId: string,
    @Body() data: SendCoachRequestDto,
  ): Promise<ApiResponse<CoachRequest>> {
    const coachId = req.user.sub;
    return this.coachService.sendRequestToMember(coachId, memberId, data);
  }
}
