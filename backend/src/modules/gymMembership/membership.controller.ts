import type { ApiResponse } from '@ahmedrioueche/gympro-client';
import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMemberDto } from '../auth/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymService } from '../gym/gym.service';
import { MemberInvitationService } from '../notifications/member-invitation.service';
import { MembershipService } from './membership.service';

interface CreateMemberResponse {
  membership: any;
  user: any;
  message: string;
  invitationSent?: {
    email: boolean;
    sms: boolean;
  };
}

interface MemberResponse {
  membership: any;
  user: any;
}

interface UpdateMemberDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  age?: string;
  subscriptionTypeId?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: string;
  membershipStatus?: string;
}

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly invitationService: MemberInvitationService,
    private readonly gymService: GymService,
  ) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyMemberships(@Req() req: any): Promise<ApiResponse<any[]>> {
    try {
      const userId = req.user.sub;
      const memberships = await this.membershipService.getMyMemberships(userId);
      return apiResponse(
        true,
        undefined,
        memberships,
        'Memberships fetched successfully',
      );
    } catch (error) {
      return apiResponse<any[]>(
        false,
        ErrorCode.FETCH_MEMBER_FAILED,
        [],
        error.message,
      );
    }
  }

  @Get('my/:gymId')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  async getMyMembershipInGym(
    @Req() req: any,
    @Param('gymId') gymId: string,
  ): Promise<ApiResponse<any>> {
    console.log('=== CONTROLLER START ===');
    console.log(
      `[MembershipController] getMyMembershipInGym called with gymId: ${gymId}`,
    );
    console.log(`[MembershipController] gymId type: ${typeof gymId}`);
    console.log(`[MembershipController] gymId length: ${gymId?.length}`);

    try {
      const userId = req.user.sub;
      console.log(`[MembershipController] userId: ${userId}`);
      console.log(`[MembershipController] userId type: ${typeof userId}`);

      const result = await this.membershipService.getMyMembershipInGym(
        userId,
        gymId,
      );
      console.log('=== CONTROLLER SUCCESS ===');
      return apiResponse(
        true,
        undefined,
        result,
        'Membership fetched successfully',
      );
    } catch (error) {
      console.error(`[MembershipController] Error:`, error);
      console.error(`[MembershipController] Error stack:`, error.stack);
      return apiResponse<any>(
        false,
        ErrorCode.FETCH_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Patch('my/:gymId/settings')
  @UseGuards(JwtAuthGuard)
  async updateMembershipSettings(
    @Req() req: any,
    @Param('gymId') gymId: string,
    @Body() dto: { settings: any },
  ): Promise<ApiResponse<any>> {
    try {
      const userId = req.user.sub;
      const result = await this.membershipService.updateMembershipSettings(
        userId,
        gymId,
        dto.settings,
      );
      return apiResponse(
        true,
        undefined,
        result,
        'Settings updated successfully',
      );
    } catch (error) {
      return apiResponse<any>(
        false,
        ErrorCode.UPDATE_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createMember(
    @Body() dto: CreateMemberDto,
    @Req() req: any,
  ): Promise<ApiResponse<CreateMemberResponse>> {
    const createdBy = req.user?.sub;

    // Create member and membership
    const result = await this.membershipService.createMember(dto, createdBy);

    // Fetch gym name
    const gym = await this.gymService.findOne(dto.gymId, false);
    const gymName = gym.name || 'Your Gym';

    let invitationResult;
    // Send invitation to all members
    if (result.isNewUser && result.setupToken) {
      // New user - send setup link
      invitationResult = await this.invitationService.sendMemberInvitation(
        dto.email,
        dto.phoneNumber,
        result.setupToken,
        gymName,
        dto.fullName,
        true, // isNewUser
      );
    } else if (!result.isNewUser) {
      // Existing user - send login link
      invitationResult =
        await this.invitationService.sendExistingUserInvitation(
          dto.email,
          dto.phoneNumber,
          gymName,
          dto.fullName,
        );
    }

    const message = result.isNewUser
      ? 'Member created successfully. Setup invitation sent.'
      : 'Existing user added to gym successfully. Login invitation sent.';

    return apiResponse(
      true,
      undefined,
      {
        membership: result.membership,
        user: result.user,
        message,
        invitationSent: invitationResult
          ? {
              email: invitationResult.emailSent,
              sms: invitationResult.smsSent,
            }
          : undefined,
      },
      message,
    );
  }

  @Get(':gymId/:membershipId')
  @UseGuards(JwtAuthGuard)
  async getMember(
    @Param('gymId') gymId: string,
    @Param('membershipId') membershipId: string,
  ): Promise<ApiResponse<MemberResponse>> {
    try {
      const result = await this.membershipService.getMember(
        membershipId,
        gymId,
      );
      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse<MemberResponse>(
        false,
        ErrorCode.FETCH_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get(':gymId/:membershipId/profile')
  @UseGuards(JwtAuthGuard)
  async getMemberProfile(
    @Param('gymId') gymId: string,
    @Param('membershipId') membershipId: string,
  ): Promise<ApiResponse<any>> {
    try {
      const result = await this.membershipService.getMemberProfile(
        membershipId,
        gymId,
      );
      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse<any>(
        false,
        ErrorCode.MEMBER_PROFILE_FETCH_ERROR,
        undefined,
        error.message,
      );
    }
  }

  @Patch(':gymId/:membershipId')
  @UseGuards(JwtAuthGuard)
  async updateMember(
    @Param('gymId') gymId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdateMemberDto,
  ): Promise<ApiResponse<MemberResponse>> {
    try {
      const result = await this.membershipService.updateMember(
        membershipId,
        gymId,
        dto,
      );
      return apiResponse(
        true,
        undefined,
        result,
        'Member updated successfully',
      );
    } catch (error) {
      return apiResponse<MemberResponse>(
        false,
        ErrorCode.UPDATE_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Post(':gymId/:membershipId/reactivate')
  @UseGuards(JwtAuthGuard)
  async reactivateSubscription(
    @Param('gymId') gymId: string,
    @Param('membershipId') membershipId: string,
    @Body()
    dto: {
      subscriptionTypeId: string;
      startDate: string;
      paymentMethod?: string;
      notes?: string;
    },
    @Req() req: any,
  ): Promise<ApiResponse<MemberResponse>> {
    try {
      const performedBy = req.user.sub;
      const result = await this.membershipService.reactivateSubscription(
        membershipId,
        gymId,
        dto,
        performedBy,
      );
      return apiResponse(
        true,
        undefined,
        result,
        'Subscription reactivated successfully',
      );
    } catch (error) {
      return apiResponse<MemberResponse>(
        false,
        ErrorCode.UPDATE_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Delete(':gymId/:membershipId')
  @UseGuards(JwtAuthGuard)
  async deleteMember(
    @Param('gymId') gymId: string,
    @Param('membershipId') membershipId: string,
  ): Promise<ApiResponse<{ deleted: boolean; membershipId: string }>> {
    try {
      const result = await this.membershipService.deleteMember(
        membershipId,
        gymId,
      );
      return apiResponse(
        true,
        undefined,
        result,
        'Member deleted successfully',
      );
    } catch (error) {
      return apiResponse<{ deleted: boolean; membershipId: string }>(
        false,
        ErrorCode.DELETE_MEMBER_FAILED,
        undefined,
        error.message,
      );
    }
  }
}
