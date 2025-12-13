import { Controller } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Settings endpoints can be added here as needed
  // Currently settings are managed through user.appSettings
}
