import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { AppSettingsModel } from './settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(AppSettingsModel.name)
    private settingsModel: Model<AppSettingsModel>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getSettings(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return current settings or default ones
    return user.appSettings || this.getDefaultSettings();
  }

  async updateSettings(userId: string, settings: any) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Merge settings
    const currentSettings = user.appSettings || this.getDefaultSettings();
    user.appSettings = {
      ...currentSettings,
      ...settings,
      notifications: settings.notifications
        ? { ...currentSettings.notifications, ...settings.notifications }
        : currentSettings.notifications,
      locale: settings.locale
        ? { ...currentSettings.locale, ...settings.locale }
        : currentSettings.locale,
    };

    const updatedUser = await user.save();
    return updatedUser.appSettings;
  }

  private getDefaultSettings() {
    return {
      theme: 'auto' as const,
      viewPreference: 'table' as const,
      notifications: {
        enablePush: true,
        enableEmail: true,
        defaultReminderMinutes: 30,
      },
      locale: {
        language: DEFAULT_LANGUAGE,
        currency: DEFAULT_CURRENCY,
      },
    };
  }

  // Keep legacy for compatibility if needed, but these are now mostly unused
  async findById(id: string) {
    return this.settingsModel.findById(id).exec();
  }

  async create(settings: Partial<AppSettingsModel>) {
    const newSettings = new this.settingsModel(settings);
    return newSettings.save();
  }

  async update(id: string, settings: Partial<AppSettingsModel>) {
    return this.settingsModel
      .findByIdAndUpdate(id, settings, { new: true })
      .exec();
  }
}
