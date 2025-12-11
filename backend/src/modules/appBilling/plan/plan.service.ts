// app-plans.service.ts
import {
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
    // Validate pricing based on type
    if (dto.type === 'subscription') {
      // Allow free plans (level === 'free') with 0 pricing
      if (dto.level !== 'free') {
        // Use strict checks to allow 0 but not null/undefined
        const hasMonthly =
          dto.pricing.monthly !== null && dto.pricing.monthly !== undefined;
        const hasYearly =
          dto.pricing.yearly !== null && dto.pricing.yearly !== undefined;

        if (!hasMonthly && !hasYearly) {
          throw new BadRequestException(
            'Subscription plans must have monthly or yearly pricing',
          );
        }

        // Ensure at least one price is greater than 0
        if (
          hasMonthly &&
          dto.pricing.monthly === 0 &&
          hasYearly &&
          dto.pricing.yearly === 0
        ) {
          throw new BadRequestException(
            'Subscription plans must have at least one non-zero price',
          );
        }
      }
    } else if (dto.type === 'oneTime') {
      if (dto.pricing.oneTime === null || dto.pricing.oneTime === undefined) {
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

  /**
   * Get plans by type (subscription or oneTime)
   */
  async getPlansByType(type: AppPlanType) {
    return this.appPlanModel.find({ type }).sort({ level: 1 }).exec();
  }

  /**
   * Get plans by level (starter, standard, premium, enterprise)
   */
  async getPlansByLevel(level: AppPlanLevel) {
    return this.appPlanModel.find({ level }).sort({ type: 1 }).exec();
  }

  /**
   * Get a specific plan by level and type
   */
  async getPlanByLevelAndType(level: AppPlanLevel, type: AppPlanType) {
    const plan = await this.appPlanModel.findOne({ level, type }).exec();

    if (!plan) {
      throw new NotFoundException(
        `Plan not found for level: ${level}, type: ${type}`,
      );
    }

    return plan;
  }

  /**
   * Get plan by ID
   */
  async getPlanById(planId: string) {
    const plan = await this.appPlanModel.findById(planId).exec();

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    return plan;
  }

  /**
   * Update an existing plan
   */
  async updatePlan(
    planId: string,
    updates: UpdateAppPlanDto,
    updatedBy?: string,
  ) {
    const plan = await this.getPlanById(planId);

    // Validate pricing updates
    if (updates.pricing) {
      const newType = updates.type || plan.type;

      if (newType === 'subscription') {
        const hasPricing =
          updates.pricing.monthly ||
          updates.pricing.yearly ||
          plan.pricing.monthly ||
          plan.pricing.yearly;

        if (!hasPricing) {
          throw new BadRequestException(
            'Subscription plans must have monthly or yearly pricing',
          );
        }
      } else if (newType === 'oneTime') {
        const hasPricing = updates.pricing.oneTime || plan.pricing.oneTime;

        if (!hasPricing) {
          throw new BadRequestException(
            'One-time plans must have oneTime pricing',
          );
        }
      }
    }

    Object.assign(plan, {
      ...updates,
      version: (plan.version || 1) + 1,
      updatedBy,
      updatedAt: new Date(),
    });

    return plan.save();
  }

  /**
   * Delete a plan
   * Note: Should check for active subscriptions before deleting
   */
  async deletePlan(planId: string) {
    const plan = await this.getPlanById(planId);

    // Optional: Add check for active subscriptions
    // const hasActiveSubscriptions = await this.checkActiveSubscriptions(planId);
    // if (hasActiveSubscriptions) {
    //   throw new BadRequestException('Cannot delete plan with active subscriptions');
    // }

    await plan.deleteOne();

    return { message: 'Plan deleted successfully', planId };
  }

  /**
   * Check if a plan exists
   */
  async planExists(planId: string): Promise<boolean> {
    const count = await this.appPlanModel
      .countDocuments({ _id: planId })
      .exec();
    return count > 0;
  }

  /**
   * Get subscription plans only
   */
  async getSubscriptionPlans() {
    return this.getPlansByType('subscription');
  }

  /**
   * Get one-time purchase plans only
   */
  async getOneTimePlans() {
    return this.getPlansByType('oneTime');
  }

  /**
   * Compare plans by level
   */
  async comparePlans(
    level1: AppPlanLevel,
    level2: AppPlanLevel,
    type: AppPlanType,
  ) {
    const plan1 = await this.getPlanByLevelAndType(level1, type);
    const plan2 = await this.getPlanByLevelAndType(level2, type);

    return {
      plan1,
      plan2,
      differences: {
        priceDifference: {
          monthly: (plan2.pricing.monthly || 0) - (plan1.pricing.monthly || 0),
          yearly: (plan2.pricing.yearly || 0) - (plan1.pricing.yearly || 0),
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
