import {
  apiResponse,
  EditUserDto,
  ErrorCode,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermission,
} from './guards/permissions.guard';
import { Roles, RolesGuard } from './guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      role,
      search,
    );
    return apiResponse(true, undefined, result, 'Users retrieved successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserRole = req.user?.role;
    const isOwnerOrManager =
      currentUserRole === UserRole.Owner ||
      currentUserRole === UserRole.Manager;
    const isSelf = id === currentUserId;

    // Allow any authenticated user to view profile, but filter sensitive data
    const result = await this.usersService.findById(id);

    // If not self and not admin, filter sensitive info
    if (!isSelf && !isOwnerOrManager) {
      if (result.profile) {
        delete result.profile.email;
        delete result.profile.phoneNumber;
        delete result.profile.address;
        // Keep public info: fullName, username, gender, age, profileImageUrl, bio
      }
      // Hide internal fields
      delete result.memberships;
      delete result.subscriptionHistory;
      delete result.notifications;
      delete result.role; // Optional: maybe we want to show role? User said "any user can be a member... calling it member profile".
      // Let's keep role as it's useful public info (e.g. Coach)
    }

    return apiResponse(true, undefined, result, 'User retrieved successfully');
  }

  @Get('email/:email')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async findByEmail(@Param('email') email: string) {
    const result = await this.usersService.findByEmail(email);
    return apiResponse(true, undefined, result, 'User retrieved successfully');
  }

  @Get('phone/:phone')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async findByPhone(@Param('phone') phone: string) {
    const result = await this.usersService.findByPhone(phone);
    return apiResponse(true, undefined, result, 'User retrieved successfully');
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Req() req: any,
  ) {
    const result = await this.usersService.update(id, updateData);
    return apiResponse(true, undefined, result, 'User updated successfully');
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: EditUserDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserRole = req.user?.role;

    // Users can update their own profile, or owner/manager can update any
    if (id !== currentUserId) {
      if (
        currentUserRole !== UserRole.Owner &&
        currentUserRole !== UserRole.Manager
      ) {
        throw new ForbiddenException({
          message: 'Insufficient permissions to update this profile',
          errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
        });
      }
    }

    const result = await this.usersService.updateProfile(id, profileData);
    return apiResponse(true, undefined, result, 'Profile updated successfully');
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Owner)
  async updateRole(
    @Param('id') id: string,
    @Body('role') newRole: UserRole,
    @Req() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const result = await this.usersService.updateRole(
      id,
      newRole,
      currentUserId,
    );
    return apiResponse(
      true,
      undefined,
      result,
      'User role updated successfully',
    );
  }

  @Patch(':id/activate')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async activate(@Param('id') id: string) {
    const result = await this.usersService.activate(id);
    return apiResponse(true, undefined, result, 'User activated successfully');
  }

  @Patch(':id/deactivate')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async deactivate(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    const result = await this.usersService.deactivate(id, currentUserId);
    return apiResponse(
      true,
      undefined,
      result,
      'User deactivated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Owner)
  async delete(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    const result = await this.usersService.delete(id, currentUserId);
    return apiResponse(true, undefined, result, 'User deleted successfully');
  }

  @Post('onboarding/detect-region')
  async detectRegion(@Req() req: any) {
    const result = await this.usersService.detectRegion(req);
    return apiResponse(true, undefined, result, 'Region detected successfully');
  }

  @Post('onboarding/complete')
  async completeOnboarding(@Body() data: any, @Req() req: any) {
    const currentUserId = req.user?.sub;
    const result = await this.usersService.completeOnboarding(
      currentUserId,
      data,
    );
    return apiResponse(
      true,
      undefined,
      result,
      'Onboarding completed successfully',
    );
  }
}
