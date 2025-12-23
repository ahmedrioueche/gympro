import {
  AppPlan,
  DEFAULT_CURRENCY,
  DEFAULT_TRIAL_DAYS_NUMBER,
  type AppPlanLevel,
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
    public readonly appPlanModel: Model<AppPlanModel>,
  ) {}

  /**
   * Create a new app plan
   */
  async createPlan(dto: CreateAppPlanDto, createdBy?: string) {
    const pricing = dto.pricing[DEFAULT_CURRENCY] || {};

    if (dto.level !== 'free') {
      const hasMonthly =
        pricing.monthly !== undefined && pricing.monthly !== null;
      const hasYearly = pricing.yearly !== undefined && pricing.yearly !== null;

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

  async getPlansByLevel(level: AppPlanLevel) {
    return this.appPlanModel.find({ level }).sort({ type: 1 }).exec();
  }

  async getPlanByLevelAndType(level: AppPlanLevel) {
    const plan = await this.appPlanModel.findOne({ level }).exec();
    if (!plan) {
      throw new NotFoundException(`Plan not found for level: ${level}`);
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
      const hasPricing = updatedPricing?.monthly || updatedPricing?.yearly;
      if (!hasPricing) {
        throw new BadRequestException(
          'Subscription plans must have monthly or yearly pricing',
        );
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
}
