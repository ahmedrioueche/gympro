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
import {
  PermissionsGuard,
  RequirePermission,
} from '../users/guards/permissions.guard';
import {
  CreateGymAnnouncementDto,
  UpdateGymAnnouncementDto,
} from './dto/create-announcement.dto';
import { GymAnnouncementService } from './gym-announcement.service';

@Controller('gym-announcements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GymAnnouncementController {
  constructor(private readonly announcementService: GymAnnouncementService) {}

  @Post()
  @RequirePermission('communication:manage' as any)
  create(@Req() req: any, @Body() createDto: CreateGymAnnouncementDto) {
    // TODO: Verify user belongs to gym in createDto.gymId?
    // Usually handled by global logic or relying on PermissionGuard to check context if robust enough.
    // For now assuming the logged in user context is valid.
    return this.announcementService.create(
      createDto,
      req.user.sub,
      req.user.name || 'Staff', // fallback if name not in token
    );
  }

  @Get()
  @RequirePermission('communication:view' as any)
  findAll(
    @Query('gymId') gymId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('isActive') isActive?: string,
  ) {
    const activeBool =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.announcementService.findAll(gymId, page, limit, activeBool);
  }

  @Get(':id')
  @RequirePermission('communication:view' as any)
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('communication:manage' as any)
  update(@Param('id') id: string, @Body() updateDto: UpdateGymAnnouncementDto) {
    return this.announcementService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermission('communication:manage' as any)
  remove(@Param('id') id: string) {
    return this.announcementService.remove(id);
  }
}
