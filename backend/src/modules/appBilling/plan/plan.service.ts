import {
  AppPlan,
  DEFAULT_CURRENCY,
  DEFAULT_TRIAL_DAYS_NUMBER,
  type AppPlanLevel,
  type AppPlanType,
  type CreateAppPlanDto,
  type UpdateAppPlanDto,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppPlanModel } from '../appBilling.schema';

@Injectable()
export class AppPlansService {
  constructor(
    @InjectModel(AppPlanModel.name)
    private readonly appPlanModel: Model<AppPlanModel>,
  ) {}

  /**
   * Create a new app plan
   */
  async createPlan(dto: CreateAppPlanDto, createdBy?: string) {
    const pricing = dto.pricing[DEFAULT_CURRENCY] || {};

    // Validate pricing based on type
    if (dto.type === 'subscription') {
      if (dto.level !== 'free') {
        const hasMonthly =
          pricing.monthly !== undefined && pricing.monthly !== null;
        const hasYearly =
          pricing.yearly !== undefined && pricing.yearly !== null;

        if (!hasMonthly && !hasYearly) {
          throw new BadRequestException(
            'Subscription plans must have monthly or yearly pricing',
          );
        }

        if (
          hasMonthly &&
          pricing.monthly === 0 &&
          hasYearly &&
          pricing.yearly === 0
        ) {
          throw new BadRequestException(
            'Subscription plans must have at least one non-zero price',
          );
        }
      }
    } else if (dto.type === 'oneTime') {
      if (pricing.oneTime === undefined || pricing.oneTime === null) {
        throw new BadRequestException(
          'One-time plans must have oneTime pricing',
        );
      }
    }

    const plan = new this.appPlanModel({
      ...dto,
      version: dto.version || 1,
      trialDays: dto.trialDays || DEFAULT_TRIAL_DAYS_NUMBER,
      createdBy,
      createdAt: new Date(),
    });

    return plan.save();
  }

  /**
   * Get all plans
   */
  async getAllPlans() {
    return this.appPlanModel.find().sort({ level: 1, type: 1 }).exec();
  }

  async getPlansByType(type: AppPlanType) {
    return this.appPlanModel.find({ type }).sort({ level: 1 }).exec();
  }

  async getPlansByLevel(level: AppPlanLevel) {
    return this.appPlanModel.find({ level }).sort({ type: 1 }).exec();
  }

  async getPlanByLevelAndType(level: AppPlanLevel, type: AppPlanType) {
    const plan = await this.appPlanModel.findOne({ level, type }).exec();
    if (!plan) {
      throw new NotFoundException(
        `Plan not found for level: ${level}, type: ${type}`,
      );
    }
    return plan;
  }

  async getPlanById(planId: string) {
    const plan = await this.appPlanModel.findById(planId).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }
    return plan;
  }

  async getPlanByPlanId(planId: string): Promise<AppPlan | null> {
    try {
      const plan = await this.appPlanModel.findOne({ planId }).lean().exec();
      if (!plan) {
        throw new NotFoundException(`Plan with planId ${planId} not found`);
      }
      return plan;
    } catch (error) {
      throw new NotFoundException(`Plan with planId ${planId} not found`);
    }
  }

  async updatePlan(
    planId: string,
    updates: UpdateAppPlanDto,
    updatedBy?: string,
  ) {
    const plan = await this.getPlanById(planId);
    const updatedPricing =
      updates.pricing?.[DEFAULT_CURRENCY] || plan.pricing[DEFAULT_CURRENCY];

    if (updates.pricing) {
      const newType = updates.type || plan.type;

      if (newType === 'subscription') {
        const hasPricing = updatedPricing?.monthly || updatedPricing?.yearly;
        if (!hasPricing) {
          throw new BadRequestException(
            'Subscription plans must have monthly or yearly pricing',
          );
        }
      } else if (newType === 'oneTime') {
        const hasPricing = updatedPricing?.oneTime;
        if (!hasPricing) {
          throw new BadRequestException(
            'One-time plans must have oneTime pricing',
          );
        }
      }
    }

    Object.assign(plan, {
      ...updates,
      version: (plan.version || 1) + 0.1,
      updatedBy,
      updatedAt: new Date(),
    });

    return plan.save();
  }

  async deletePlan(planId: string) {
    const plan = await this.getPlanById(planId);
    await plan.deleteOne();
    return { message: 'Plan deleted successfully', planId };
  }

  async planExists(planId: string): Promise<boolean> {
    const count = await this.appPlanModel
      .countDocuments({ _id: planId })
      .exec();
    return count > 0;
  }

  async getSubscriptionPlans() {
    return this.getPlansByType('subscription');
  }

  async getOneTimePlans() {
    return this.getPlansByType('oneTime');
  }

  async comparePlans(
    level1: AppPlanLevel,
    level2: AppPlanLevel,
    type: AppPlanType,
  ) {
    const plan1 = await this.getPlanByLevelAndType(level1, type);
    const plan2 = await this.getPlanByLevelAndType(level2, type);

    const price1 = plan1.pricing[DEFAULT_CURRENCY] || {};
    const price2 = plan2.pricing[DEFAULT_CURRENCY] || {};

    return {
      plan1,
      plan2,
      differences: {
        priceDifference: {
          monthly: (price2.monthly || 0) - (price1.monthly || 0),
          yearly: (price2.yearly || 0) - (price1.yearly || 0),
        },
        limitDifferences: {
          maxGyms: (plan2.limits.maxGyms || 0) - (plan1.limits.maxGyms || 0),
          maxMembers:
            (plan2.limits.maxMembers || 0) - (plan1.limits.maxMembers || 0),
          maxGems: (plan2.limits.maxGems || 0) - (plan1.limits.maxGems || 0),
        },
      },
    };
  }
}
