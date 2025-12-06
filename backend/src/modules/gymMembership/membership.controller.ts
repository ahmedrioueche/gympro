import type { ApiResponse } from '@ahmedrioueche/gympro-client';
import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
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
