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

  constructor(
    private readonly configService: ConfigService,
    private readonly appSubscriptionService: AppSubscriptionService,
    private readonly appPlansService: AppPlansService,
  ) {
    this.apiKey = PADDLE_API_KEY || '';
    this.apiUrl = PADDLE_URL || '';

    if (!this.apiKey) {
      this.logger.warn('PADDLE_API_KEY is not configured');
    }
  }

  /**
   * Create a Paddle-hosted checkout session
   * Paddle will return a real checkout URL (checkout.paddle.com)
   */
  async createCheckout(dto: CreateCheckoutDto, userId: string) {
    try {
      const payload = {
        items: dto.items.map((item) => ({
          price_id: item.priceId,
          quantity: item.quantity,
        })),
        customer_id: dto.customerId,
        custom_data: {
          userId,
          ...dto.customData,
        },
      };

      const response = await axios.post(
        `${this.apiUrl}/transactions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const transaction = response.data.data;
      console.log({ transaction });
      if (!transaction?.checkout?.url) {
        throw new Error('Paddle did not return a checkout URL');
      }

      this.logger.log(
        `Checkout created: txn=${transaction.id}, url=${transaction.checkout.url}`,
      );

      return {
        checkout_url: transaction.checkout.url,
        transaction_id: transaction.id,
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
    // 1️⃣ Fetch plan
    const plan = await this.appPlansService.getPlanByPlanId(planId);
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    // 2️⃣ Validate Paddle config
    if (!plan.paddleProductId || !plan.paddlePriceIds) {
      throw new BadRequestException(
        `Paddle configuration missing for plan: ${planId}`,
      );
    }

    // 3️⃣ Resolve price ID
    const priceId = this.getPaddlePriceId(plan, billingCycle);
    if (!priceId) {
      throw new BadRequestException(
        `Price ID not found for plan=${planId}, billing=${billingCycle}`,
      );
    }

    this.logger.log(
      `Creating Paddle checkout → plan=${planId}, billing=${billingCycle}, price=${priceId}`,
    );

    // 4️⃣ Create hosted checkout
    return this.createCheckout(
      {
        items: [{ priceId, quantity: 1 }],
        customerId,
        customData: {
          planId,
          billingCycle,
          type: plan.type, // subscription | oneTime
        },
      },
      userId,
    );
  }

  /**
   * Resolve Paddle price ID from plan + billing cycle
   */
  private getPaddlePriceId(
    plan: any,
    billingCycle: AppSubscriptionBillingCycle,
  ): string | null {
    if (plan.type === 'subscription') {
      if (billingCycle === 'monthly') {
        return plan.paddlePriceIds.monthly || null;
      }
      if (billingCycle === 'yearly') {
        return plan.paddlePriceIds.yearly || null;
      }
    }

    if (plan.type === 'oneTime') {
      return plan.paddlePriceIds.oneTime || null;
    }

    return null;
  }

  /**
   * Fetch transaction status (used by frontend polling)
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
      this.logger.error('Failed to fetch transaction', error);
      throw new BadRequestException('Failed to fetch transaction status');
    }
  }

  /**
   * Verify Paddle webhook signature
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    try {
      const crypto = require('crypto');
      const secret = this.configService.get<string>('PADDLE_WEBHOOK_SECRET');
      if (!secret) return false;

      const parts = signature.split(';');
      const ts = parts[0]?.split('=')[1];
      const h1 = parts[1]?.split('=')[1];
      if (!ts || !h1) return false;

      const payload = `${ts}:${body}`;
      const computed = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(computed));
    } catch {
      return false;
    }
  }

  /**
   * Paddle webhook dispatcher
   */
  async handleWebhook(event: any) {
    this.logger.log(`Paddle webhook: ${event.event_type}`);

    switch (event.event_type) {
      case 'transaction.completed':
        await this.handleTransactionCompleted(event.data);
        break;

      default:
        this.logger.warn(`Unhandled Paddle event: ${event.event_type}`);
    }
  }

  /**
   * Activate subscription after successful payment
   */
  private async handleTransactionCompleted(data: any) {
    try {
      const customData = data.custom_data;
      if (!customData?.userId || !customData?.planId) {
        this.logger.error('Missing custom_data in transaction');
        return;
      }

      const { userId, planId, billingCycle } = customData;

      await this.appSubscriptionService.subscribe(
        userId,
        planId,
        billingCycle || 'monthly',
      );

      this.logger.log(
        `Subscription activated → user=${userId}, plan=${planId}`,
      );
    } catch (error) {
      this.logger.error('Subscription activation failed', error);
    }
  }
}
