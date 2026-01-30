import {
  ApiResponse,
  CoachAnalytics,
  CoachClient,
  CoachPricingTier,
  CoachPricingTierDto,
  CoachProfile,
  CoachQueryDto,
  CoachRequest,
  CoachRequestWithDetails,
  GymCoachAffiliation,
  ProspectiveMember,
  ProspectiveMembersQueryDto,
  RequestCoachDto,
  RespondToRequestDto,
  SendCoachRequestDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymCoachService } from '../gym-coach/gym-coach.service';
import { CoachService } from './coach.service';

@Controller('coaches')
@UseGuards(JwtAuthGuard)
export class CoachController {
  constructor(
    private readonly coachService: CoachService,
    private readonly gymCoachService: GymCoachService,
  ) {}

  // ============================================
  // SPECIFIC ROUTES (must come before :coachId)
  // ============================================

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: any) {
    const coachId = req.user.sub;
    return this.coachService.getDashboardStats(coachId);
  }

  @Get('dashboard/activity')
  async getDashboardActivity(@Req() req: any) {
    const coachId = req.user.sub;
    return this.coachService.getDashboardActivity(coachId);
  }

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

  @Get('requests/sent')
  async getSentRequests(
    @Req() req: any,
  ): Promise<ApiResponse<CoachRequestWithDetails[]>> {
    const coachId = req.user.sub;
    return this.coachService.getSentRequests(coachId);
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

  @Get('pricing')
  async getMyPricing(
    @Req() req: any,
  ): Promise<ApiResponse<CoachPricingTier[]>> {
    const coachId = req.user.sub;
    return this.coachService.getMyPricing(coachId);
  }

  @Post('pricing')
  async createPricing(
    @Req() req: any,
    @Body() data: CoachPricingTierDto,
  ): Promise<ApiResponse<CoachPricingTier>> {
    const coachId = req.user.sub;
    return this.coachService.createPricing(coachId, data);
  }

  @Patch('pricing/:pricingId')
  async updatePricing(
    @Req() req: any,
    @Param('pricingId') pricingId: string,
    @Body() data: Partial<CoachPricingTierDto>,
  ): Promise<ApiResponse<CoachPricingTier>> {
    const coachId = req.user.sub;
    return this.coachService.updatePricing(coachId, pricingId, data);
  }

  @Delete('pricing/:pricingId')
  async deletePricing(
    @Req() req: any,
    @Param('pricingId') pricingId: string,
  ): Promise<ApiResponse<void>> {
    const coachId = req.user.sub;
    return this.coachService.deletePricing(coachId, pricingId);
  }

  // Note: affiliations route is handled by GymCoachController at /coaches/affiliations

  @Get('affiliations')
  async getCoachAffiliations(
    @Req() req: any,
  ): Promise<ApiResponse<GymCoachAffiliation[]>> {
    const coachId = req.user.sub;
    return this.gymCoachService.getCoachAffiliations(coachId);
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
  @Post('clients/:userId/program')
  async assignProgram(
    @Req() req: any,
    @Param('userId') clientId: string,
    @Body() body: { programId: string },
  ) {
    const coachId = req.user.sub;
    return this.coachService.assignProgramToClient(
      coachId,
      clientId,
      body.programId,
    );
  }
}
