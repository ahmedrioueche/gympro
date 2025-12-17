import { AppSubscriptionBillingCycle } from '@ahmedrioueche/gympro-client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import 'dotenv/config';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
const PADDLE_URL = process.env.PADDLE_URL;

interface PaddleCheckoutItem {
  priceId: string;
  quantity: number;
}

interface CreateCheckoutDto {
  items: PaddleCheckoutItem[];
  customerId?: string;
  customData?: Record<string, any>;
}

@Injectable()
export class PaddleService {
  private readonly logger = new Logger(PaddleService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly successUrl: string;
  private readonly cancelUrl: string;

  constructor(
    private configService: ConfigService,
    private readonly appSubscriptionService: AppSubscriptionService,
    private readonly appPlansService: AppPlansService,
  ) {
    this.apiKey = PADDLE_API_KEY || '';
    this.apiUrl = PADDLE_URL || '';

    const frontendUrl =
      this.configService.get('NODE_ENV') === 'production'
        ? this.configService.get('PROD_FRONTEND_URL')
        : this.configService.get('DEV_FRONTEND_URL');

    this.successUrl =
      this.configService.get<string>('PADDLE_SUCCESS_URL') ||
      `${frontendUrl}/payment/success`;
    this.cancelUrl =
      this.configService.get<string>('PADDLE_FAILURE_URL') ||
      `${frontendUrl}/payment/failure`;

    if (!this.apiKey) {
      this.logger.warn('PADDLE_API_KEY is not configured');
    }
  }

  /**
   * Create a checkout session
   */
  async createCheckout(dto: CreateCheckoutDto, userId: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/transactions`,
        {
          items: dto.items.map((item) => ({
            price_id: item.priceId,
            quantity: item.quantity,
          })),
          customer_id: dto.customerId,
          custom_data: {
            userId,
            ...dto.customData,
          },
          checkout: {
            url: this.successUrl,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        checkout_url: response.data.data.checkout.url,
        transaction_id: response.data.data.id,
      };
    } catch (error) {
      this.logger.error(
        'Failed to create Paddle checkout',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  /**
   * Create a subscription checkout for a plan
   */
  async createSubscriptionCheckout(
    planId: string,
    billingCycle: AppSubscriptionBillingCycle,
    userId: string,
    customerId?: string,
  ) {
    try {
      // Fetch plan from database
      const plan = await this.appPlansService.getPlanByPlanId(planId);

      if (!plan) {
        throw new BadRequestException('Plan not found');
      }

      // Check if plan has Paddle product ID configured
      if (!plan.paddleProductId) {
        throw new BadRequestException(
          `Paddle product ID not configured for plan: ${planId}`,
        );
      }

      // Get the correct price ID based on billing cycle
      const priceId = this.getPaddlePriceId(plan, billingCycle);

      if (!priceId) {
        throw new BadRequestException(
          `Paddle price ID not configured for plan: ${planId}, billing cycle: ${billingCycle}`,
        );
      }

      this.logger.log(
        `Creating checkout for plan ${planId}, billing cycle: ${billingCycle}, price ID: ${priceId}`,
      );

      return await this.createCheckout(
        {
          items: [{ priceId, quantity: 1 }],
          customerId,
          customData: {
            planId,
            billingCycle,
            type: plan.type, // 'subscription' or 'oneTime'
          },
        },
        userId,
      );
    } catch (error) {
      this.logger.error('Failed to create subscription checkout', error);
      throw error;
    }
  }

  /**
   * Get Paddle price ID from plan based on billing cycle
   */
  private getPaddlePriceId(
    plan: any,
    billingCycle: AppSubscriptionBillingCycle,
  ): string | null {
    if (!plan.paddlePriceIds) {
      this.logger.error(`Plan ${plan.planId} has no paddlePriceIds configured`);
      return null;
    }

    // For subscription plans
    if (plan.type === 'subscription') {
      if (billingCycle === 'monthly' && plan.paddlePriceIds.monthly) {
        return plan.paddlePriceIds.monthly;
      }
      if (billingCycle === 'yearly' && plan.paddlePriceIds.yearly) {
        return plan.paddlePriceIds.yearly;
      }
    }

    // For one-time plans
    if (plan.type === 'oneTime' && plan.paddlePriceIds.oneTime) {
      return plan.paddlePriceIds.oneTime;
    }

    this.logger.error(
      `No price ID found for plan ${plan.planId}, type: ${plan.type}, billing cycle: ${billingCycle}`,
    );
    return null;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      this.logger.error('Failed to get transaction status', error);
      throw new BadRequestException('Failed to get transaction status');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    try {
      const crypto = require('crypto');
      const secret = this.configService.get<string>('PADDLE_WEBHOOK_SECRET');

      if (!secret) {
        this.logger.error('PADDLE_WEBHOOK_SECRET not configured');
        return false;
      }

      // Paddle uses ts_and_hash format: ts={timestamp};h1={hash}
      const parts = signature.split(';');
      const tsMatch = parts[0].match(/ts=(\d+)/);
      const h1Match = parts[1].match(/h1=([a-f0-9]+)/);

      if (!tsMatch || !h1Match) {
        return false;
      }

      const timestamp = tsMatch[1];
      const hash = h1Match[1];

      // Recreate the signature
      const payload = `${timestamp}:${body}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const computedHash = hmac.digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(computedHash),
      );
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      return false;
    }
  }

  /**
   * Handle webhook event
   */
  async handleWebhook(event: any) {
    this.logger.log(`Received Paddle webhook: ${event.event_type}`);

    switch (event.event_type) {
      case 'transaction.completed':
        await this.handleTransactionCompleted(event.data);
        break;
      case 'transaction.updated':
        await this.handleTransactionUpdated(event.data);
        break;
      case 'subscription.created':
        await this.handleSubscriptionCreated(event.data);
        break;
      case 'subscription.updated':
        await this.handleSubscriptionUpdated(event.data);
        break;
      case 'subscription.canceled':
        await this.handleSubscriptionCanceled(event.data);
        break;
      default:
        this.logger.warn(`Unhandled webhook event: ${event.event_type}`);
    }
  }

  private async handleTransactionCompleted(data: any) {
    this.logger.log(`Transaction completed: ${data.id}`);

    try {
      // Extract user metadata
      const customData = data.custom_data;
      if (!customData?.userId || !customData?.planId) {
        this.logger.error(
          'Missing userId or planId in transaction custom_data',
        );
        return;
      }

      const { userId, planId, billingCycle, type } = customData;

      // Activate subscription
      await this.appSubscriptionService.subscribe(
        userId,
        planId,
        billingCycle || 'monthly',
      );

      this.logger.log(
        `Subscription activated for user ${userId} with plan ${planId} (${type})`,
      );
    } catch (error) {
      this.logger.error('Error activating subscription', error);
      // Don't throw - webhook should return 200 even if our logic fails
    }
  }

  private async handleTransactionUpdated(data: any) {
    this.logger.log(`Transaction updated: ${data.id}`);
    // TODO: Handle transaction updates if needed
  }

  private async handleSubscriptionCreated(data: any) {
    this.logger.log(`Subscription created: ${data.id}`);
    // TODO: Handle subscription creation
  }

  private async handleSubscriptionUpdated(data: any) {
    this.logger.log(`Subscription updated: ${data.id}`);
    // TODO: Handle subscription updates (renewals, changes)
  }

  private async handleSubscriptionCanceled(data: any) {
    this.logger.log(`Subscription canceled: ${data.id}`);
    // TODO: Handle subscription cancellation
  }
}
