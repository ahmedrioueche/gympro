import { apiResponse, UpdateSettingsDto } from '@ahmedrioueche/gympro-client';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req: any) {
    const userId = req.user.sub;
    const result = await this.settingsService.getSettings(userId);
    return apiResponse(
      true,
      undefined,
      result,
      'Settings retrieved successfully',
    );
  }

  @Patch()
  async updateSettings(@Req() req: any, @Body() data: UpdateSettingsDto) {
    const userId = req.user.sub;
    const result = await this.settingsService.updateSettings(userId, data);
    return apiResponse(
      true,
      undefined,
      result,
      'Settings updated successfully',
    );
  }
}
