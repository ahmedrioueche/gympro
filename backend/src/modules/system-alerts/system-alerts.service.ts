import {
  type CreateAppBannerDto,
  type UpdateAppBannerDto,
} from '@ahmedrioueche/gympro-client';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionBlockerService } from '../app-billing/subscription/subscription-blocker.service';
import { SystemAlertModel } from './system-alerts.schema';

@Injectable()
export class SystemAlertsService {
  constructor(
    @InjectModel('SystemAlert')
    private readonly systemAlertModel: Model<SystemAlertModel>,
    @Inject(forwardRef(() => SubscriptionBlockerService))
    private readonly subscriptionBlockerService: SubscriptionBlockerService,
  ) {}

  async create(createDto: CreateAppBannerDto) {
    const createdAlert = new this.systemAlertModel(createDto);
    return createdAlert.save();
  }

  async findAll() {
    return this.systemAlertModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActive(userId?: string) {
    const activeBanners = await this.systemAlertModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();

    if (!userId) {
      return activeBanners.filter(
        (b) => b.templateKey !== 'SUBSCRIPTION_WARNING',
      );
    }

    const blockerConfig =
      await this.subscriptionBlockerService.getBlockerConfig(userId);

    return activeBanners.filter((banner) => {
      // If it's a subscription warning banner, only show if user has an active warning
      if (banner.templateKey === 'SUBSCRIPTION_WARNING') {
        return blockerConfig && blockerConfig.show;
      }
      return true;
    });
  }

  async findOne(id: string) {
    const alert = await this.systemAlertModel.findById(id).exec();
    if (!alert) {
      throw new NotFoundException(`System Alert with ID ${id} not found`);
    }
    return alert;
  }

  async update(id: string, updateDto: UpdateAppBannerDto) {
    const updatedAlert = await this.systemAlertModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedAlert) {
      throw new NotFoundException(`System Alert with ID ${id} not found`);
    }
    return updatedAlert;
  }

  async remove(id: string) {
    const deletedAlert = await this.systemAlertModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAlert) {
      throw new NotFoundException(`System Alert with ID ${id} not found`);
    }
    return deletedAlert;
  }
}
