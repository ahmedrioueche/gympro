import {
  AppPaymentFilterDto,
  AppPaymentStatus,
  GetAppPaymentDto,
  GetAppPaymentsResponseDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppPlanModel } from '../appBilling.schema';
import { AppPaymentModel } from './appPayment.schema';

@Injectable()
export class AppPaymentService {
  private readonly logger = new Logger(AppPaymentService.name);

  constructor(
    @InjectModel(AppPaymentModel.name)
    private readonly paymentModel: Model<AppPaymentModel>,
    @InjectModel(AppPlanModel.name)
    private readonly planModel: Model<AppPlanModel>,
  ) {}

  /**
   * Create a new payment record
   */
  async createPayment(data: {
    userId: string;
    subscriptionId: string;
    planId: string;
    amount: number;
    currency: string;
    status: AppPaymentStatus;
    provider: 'paddle' | 'chargily';
    providerTransactionId: string;
    providerCustomerId?: string;
    paymentMethod?: string;
    description?: string;
    metadata?: Record<string, any>;
    paidAt?: Date;
  }): Promise<AppPaymentModel> {
    try {
      const payment = new this.paymentModel({
        ...data,
        createdAt: new Date(),
      });

      const saved = await payment.save();
      this.logger.log(
        `Payment created: ${saved._id} for user ${data.userId}, amount: ${data.amount} ${data.currency}`,
      );
      return saved;
    } catch (error) {
      this.logger.error('Failed to create payment', error);
      throw error;
    }
  }

  /**
   * Get a single payment by ID with populated data
   */
  async getPaymentById(
    paymentId: string,
    userId: string,
  ): Promise<GetAppPaymentDto | null> {
    const payment = await this.paymentModel
      .findOne({ _id: paymentId, userId })
      .lean()
      .exec();

    if (!payment) {
      return null;
    }

    // Populate plan data
    const plan = await this.planModel
      .findOne({ planId: payment.planId })
      .select('_id planId name level')
      .lean()
      .exec();

    return {
      ...payment,
      plan: plan
        ? {
            _id: plan._id,
            planId: plan.planId,
            name: plan.name,
            level: plan.level,
          }
        : undefined,
    } as GetAppPaymentDto;
  }

  /**
   * Get user's payments with filtering, pagination, and search
   */
  async getUserPayments(
    userId: string,
    filters: AppPaymentFilterDto = {},
  ): Promise<GetAppPaymentsResponseDto> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      provider,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query: any = { userId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by provider
    if (provider) {
      query.provider = provider;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search by transaction ID or description
    if (search) {
      query.$or = [
        { providerTransactionId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    if (sortBy === 'date') {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'amount') {
      sort.amount = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.paymentModel.countDocuments(query).exec(),
    ]);

    // Populate plan data for all payments
    const planIds = [...new Set(payments.map((p) => p.planId))];
    const plans = await this.planModel
      .find({ planId: { $in: planIds } })
      .select('_id planId name level')
      .lean()
      .exec();

    const planMap = new Map(plans.map((p) => [p.planId, p]));

    const paymentsWithPlans: GetAppPaymentDto[] = payments.map((payment) => {
      const plan = planMap.get(payment.planId);
      return {
        ...payment,
        plan: plan
          ? {
              _id: plan._id,
              planId: plan.planId,
              name: plan.name,
              level: plan.level,
            }
          : undefined,
      } as GetAppPaymentDto;
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: paymentsWithPlans,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    paymentId: string,
    status: AppPaymentStatus,
  ): Promise<AppPaymentModel | null> {
    const updateData: any = { status, updatedAt: new Date() };

    if (status === 'completed' && !updateData.paidAt) {
      updateData.paidAt = new Date();
    } else if (status === 'refunded') {
      updateData.refundedAt = new Date();
    }

    const payment = await this.paymentModel
      .findByIdAndUpdate(paymentId, updateData, { new: true })
      .exec();

    if (payment) {
      this.logger.log(`Payment ${paymentId} status updated to ${status}`);
    }

    return payment;
  }

  /**
   * Record a refund
   */
  async recordRefund(paymentId: string): Promise<AppPaymentModel | null> {
    return this.updatePaymentStatus(paymentId, 'refunded');
  }

  /**
   * Get payment statistics for a user
   */
  async getPaymentStats(userId: string) {
    const payments = await this.paymentModel.find({ userId }).lean().exec();

    const totalPayments = payments.length;
    const totalRevenue = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // This month's revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRevenue = payments
      .filter(
        (p) =>
          p.status === 'completed' && new Date(p.createdAt) >= startOfMonth,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    // Success rate
    const completedPayments = payments.filter(
      (p) => p.status === 'completed',
    ).length;
    const successRate =
      totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;

    // Revenue by provider
    const revenueByProvider = {
      paddle: payments
        .filter((p) => p.provider === 'paddle' && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      chargily: payments
        .filter((p) => p.provider === 'chargily' && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
    };

    return {
      totalPayments,
      totalRevenue,
      thisMonthRevenue,
      successRate,
      revenueByProvider,
    };
  }
}
