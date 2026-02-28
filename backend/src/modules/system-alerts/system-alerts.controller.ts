import {
  UserRole,
  type CreateAppBannerDto,
  type UpdateAppBannerDto,
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
import { Roles, RolesGuard } from '../users/guards/roles.guard';
import { SystemAlertsService } from './system-alerts.service';

@Controller('system-alerts')
@UseGuards(JwtAuthGuard)
export class SystemAlertsController {
  constructor(private readonly systemAlertsService: SystemAlertsService) {}

  @Get('active')
  findActive(@Req() req: any) {
    const userId = req?.user?.sub;
    return this.systemAlertsService.findActive(userId);
  }

  // Admin and Super Admin endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.AppEditor, UserRole.Manager, UserRole.Owner)
  create(@Body() createDto: CreateAppBannerDto) {
    return this.systemAlertsService.create(createDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.AppEditor, UserRole.Manager, UserRole.Owner)
  findAll() {
    return this.systemAlertsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.AppEditor, UserRole.Manager, UserRole.Owner)
  findOne(@Param('id') id: string) {
    return this.systemAlertsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.AppEditor, UserRole.Manager, UserRole.Owner)
  update(@Param('id') id: string, @Body() updateDto: UpdateAppBannerDto) {
    return this.systemAlertsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.AppEditor, UserRole.Manager, UserRole.Owner)
  remove(@Param('id') id: string) {
    return this.systemAlertsService.remove(id);
  }
}
