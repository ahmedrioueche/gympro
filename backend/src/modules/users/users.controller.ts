import { UserErrorCode, UserRole } from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermission,
} from './guards/permissions.guard';
import { Roles, RolesGuard } from './guards/roles.guard';
import { UsersService } from './users.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

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
    return this.usersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      role,
      search,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserRole = req.user?.role;

    // Users can view their own profile, or owner/manager can view any
    if (id !== currentUserId) {
      if (
        currentUserRole !== UserRole.Owner &&
        currentUserRole !== UserRole.Manager
      ) {
        throw new ForbiddenException({
          message: 'Insufficient permissions to view this user',
          errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS,
        });
      }
    }

    return this.usersService.findById(id);
  }

  @Get('email/:email')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Req() req: any,
  ) {
    return this.usersService.update(id, updateData);
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: any,
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
          errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS,
        });
      }
    }

    return this.usersService.updateProfile(id, profileData);
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
    return this.usersService.updateRole(id, newRole, currentUserId);
  }

  @Patch(':id/activate')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canManageMembers')
  async deactivate(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    return this.usersService.deactivate(id, currentUserId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Owner)
  async delete(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.sub;
    return this.usersService.delete(id, currentUserId);
  }
}
