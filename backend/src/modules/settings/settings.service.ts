import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSettingsModel } from './settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(AppSettingsModel.name)
    private settingsModel: Model<AppSettingsModel>,
  ) {}

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
