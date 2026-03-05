import {
  CreateAppFeaturePackageDto,
  UpdateAppFeaturePackageDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppFeaturePackageModel } from './feature-package.schema';

@Injectable()
export class AppFeaturePackageService {
  private readonly logger = new Logger(AppFeaturePackageService.name);

  constructor(
    @InjectModel(AppFeaturePackageModel.name)
    private readonly packageModel: Model<AppFeaturePackageModel>,
  ) {}

  async create(dto: CreateAppFeaturePackageDto) {
    return this.packageModel.create(dto);
  }

  async findAll(activeOnly = false) {
    const query = activeOnly ? { isActive: true } : {};
    return this.packageModel.find(query).sort({ order: 1 }).exec();
  }

  async findOne(id: string) {
    return this.packageModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateAppFeaturePackageDto) {
    return this.packageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.packageModel.findByIdAndDelete(id).exec();
  }
}
