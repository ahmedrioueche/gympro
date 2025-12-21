import { AppSubscriptionBillingCycle } from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';

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
  public readonly apiKey: string;
  public readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AppSubscriptionService))
    public readonly appSubscriptionService: AppSubscriptionService,
    private readonly appPlansService: AppPlansService,
  ) {
    this.apiKey = this.configService.get<string>('PADDLE_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('PADDLE_URL') || '';

    const webhookSecret = this.configService.get<string>(
      'PADDLE_WEBHOOK_SECRET',
    );
    this.logger.log(
      `Paddle Config: API_URL=${this.apiUrl || 'MISSING'}, API_KEY=${this.apiKey ? 'PRESENT' : 'MISSING'}`,
    );
    this.logger.log(
      `Webhook Secret: ${webhookSecret ? `PRESENT (Length: ${webhookSecret.length}, Prefix: ${webhookSecret.substring(0, 4)}...)` : 'MISSING'}`,
    );

    if (!this.apiKey) {
      this.logger.warn('PADDLE_API_KEY is not configured');
    }
  }

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
  public getPaddlePriceId(
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
   * Cancel a subscription at the end of the billing period
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      this.logger.log(`Cancelling Paddle subscription: ${subscriptionId}`);

      const response = await axios.post(
        `${this.apiUrl}/subscriptions/${subscriptionId}/cancel`,
        {
          effective_from: 'next_billing_period',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data;
    } catch (error) {
      this.logger.error(
        'Failed to cancel Paddle subscription',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to cancel subscription in Paddle');
    }
  }

  /**
   * Preview the proration for an upgrade before committing
   */
  async previewUpgrade(subscriptionId: string, priceId: string) {
    try {
      this.logger.log(
        `Previewing upgrade: sub=${subscriptionId}, newPrice=${priceId}`,
      );

      const payload = {
        proration_billing_mode: 'prorated_immediately',
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
      };

      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}/preview`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const preview = response.data.data;

      this.logger.log(
        `Upgrade preview: immediateTotal=${preview.immediate_transaction?.details?.totals?.total}, credit=${preview.credit}`,
      );

      return {
        immediate_transaction: preview.immediate_transaction,
        next_transaction: preview.next_transaction,
        credit: preview.credit,
        update_summary: preview.update_summary,
      };
    } catch (error) {
      this.logger.error(
        'Failed to preview upgrade',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to preview upgrade in Paddle');
    }
  }

  /**
   * ✅ Create a transaction for upgrading/downgrading an existing subscription
   * This handles proration automatically in Paddle and charges immediately
   */
  async createUpgradeTransaction(
    subscriptionId: string,
    priceId: string,
  ): Promise<{
    success?: boolean;
    message?: string;
    transaction_id?: string;
    checkout_url?: string;
    details?: any;
  }> {
    try {
      this.logger.log(
        `Creating Upgrade Transaction: sub=${subscriptionId}, newPrice=${priceId}`,
      );

      const payload = {
        proration_billing_mode: 'prorated_immediately',
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
      };

      // ✅ Use PATCH to update subscription (Paddle charges immediately if needed)
      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data.data;
      const transaction = data.immediate_transaction;

      // ✅ Case 1: No immediate transaction (fully covered by credit or no payment needed)
      if (!transaction) {
        this.logger.log(
          `Upgrade applied immediately without transaction (covered by credit). SubId: ${subscriptionId}`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
        };
      }

      // ✅ Case 2: Transaction created but payment succeeded immediately
      if (transaction.status === 'completed') {
        this.logger.log(
          `Upgrade transaction completed immediately: id=${transaction.id}`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
          transaction_id: transaction.id,
        };
      }

      // ✅ Case 3: Payment requires action (e.g., authentication, new payment method)
      if (transaction.checkout?.url) {
        this.logger.log(
          `Upgrade requires payment: id=${transaction.id}, url=${transaction.checkout.url}`,
        );
        return {
          success: false,
          transaction_id: transaction.id,
          checkout_url: transaction.checkout.url,
          details: transaction.details,
        };
      }

      // ✅ Case 4: Transaction pending
      this.logger.log(
        `Upgrade transaction pending: id=${transaction.id}, status=${transaction.status}`,
      );
      return {
        success: false,
        transaction_id: transaction.id,
        message: 'Payment pending',
      };
    } catch (error) {
      this.logger.error(
        'Failed to create upgrade transaction',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to prepare upgrade in Paddle');
    }
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
      const secret = this.configService.get<string>('PADDLE_WEBHOOK_SECRET');
      if (!secret) {
        this.logger.error('PADDLE_WEBHOOK_SECRET is not configured in .env');
        return false;
      }

      const parts = signature.split(';');
      const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1];
      const h1 = parts.find((p) => p.startsWith('h1='))?.split('=')[1];

      if (!ts || !h1) {
        this.logger.error(
          `Invalid signature format. Missing ts or h1 in: ${signature}`,
        );
        return false;
      }

      const payload = `${ts}:${body}`;
      const computed = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const h1Buffer = Buffer.from(h1, 'hex');
      const computedBuffer = Buffer.from(computed, 'hex');

      if (h1Buffer.length !== computedBuffer.length) {
        this.logger.error(
          `Signature length mismatch. h1=${h1Buffer.length}, computed=${computedBuffer.length}`,
        );
        return false;
      }

      const isValid = crypto.timingSafeEqual(h1Buffer, computedBuffer);

      if (!isValid) {
        this.logger.error(
          'SIGNATURE VERIFICATION FAILED: The computed HMAC did not match the h1 header.',
        );
        this.logger.debug(`Payload used: ${payload}`);
      } else {
        this.logger.log('Signature verified successfully.');
      }

      return isValid;
    } catch (error) {
      this.logger.error('Error during signature verification', error);
      return false;
    }
  }

  /**
   * Paddle webhook dispatcher
   */
  async handleWebhook(event: any) {
    this.logger.log(
      `Paddle webhook received: type=${event.event_type}, id=${event.id}`,
    );
    console.log('Full Event Data:', JSON.stringify(event, null, 2));

    switch (event.event_type) {
      case 'transaction.completed':
        this.logger.log(
          `Processing transaction.completed for txn=${event.data.id}`,
        );
        await this.handleTransactionCompleted(event.data);
        break;

      case 'subscription.updated':
        this.logger.log(
          `Processing subscription.updated for sub=${event.data.id}`,
        );
        await this.handleSubscriptionUpdated(event.data);
        break;

      case 'subscription.canceled':
        this.logger.log(
          `Processing subscription.canceled for sub=${event.data.id}`,
        );
        await this.handleSubscriptionCanceled(event.data);
        break;

      default:
        this.logger.warn(`Unhandled Paddle event: ${event.event_type}`);
    }
  }

  private async handleTransactionCompleted(data: any) {
    try {
      const customData = data.custom_data;
      this.logger.log(
        `Transaction data: id=${data.id}, status=${data.status}, hasCustomData=${!!customData}`,
      );

      if (!customData?.userId || !customData?.planId) {
        this.logger.error(
          `Missing custom_data or required fields in transaction ${data.id}. CustomData: ${JSON.stringify(customData)}`,
        );
        return;
      }

      const { userId, planId, billingCycle } = customData;
      const paddleSubscriptionId = data.subscription_id;
      const paddleCustomerId = data.customer_id;
      const currency = data.currency_code || 'USD';

      this.logger.log(
        `Activating subscription → userId=${userId}, planId=${planId}, billingCycle=${billingCycle || 'monthly'}, provider=paddle, paddleSubId=${paddleSubscriptionId}`,
      );

      await this.appSubscriptionService.subscribe(
        userId,
        planId,
        billingCycle || 'monthly',
        currency,
        'paddle',
        paddleSubscriptionId,
        paddleCustomerId,
      );

      this.logger.log(
        `Subscription activated via Paddle → user=${userId}, plan=${planId}, subId=${paddleSubscriptionId}`,
      );
    } catch (error) {
      this.logger.error('Subscription activation failed', error);
      this.logger.error(`Error details: ${JSON.stringify(error)}`);
    }
  }

  private async handleSubscriptionUpdated(data: any) {
    try {
      const paddleSubscriptionId = data.id;
      const status = data.status;
      const currentPeriodEnd = data.current_billing_period?.ends_at;

      const sub = await this.appSubscriptionService.subscriptionModel
        .findOne({ paddleSubscriptionId })
        .exec();

      if (!sub) {
        this.logger.warn(
          `Subscription not found for update: ${paddleSubscriptionId}`,
        );
        return;
      }

      // Sync status
      if (status === 'active' || status === 'trialing') {
        sub.status = 'active';
      } else if (status === 'past_due') {
        sub.status = 'active';
      } else {
        sub.status = 'cancelled';
      }

      // Sync billing period
      if (currentPeriodEnd) {
        sub.currentPeriodEnd = new Date(currentPeriodEnd);
        if (sub.status === 'active') sub.endDate = sub.currentPeriodEnd;
      }

      // ✅ Sync cancellation scheduled state
      if (data.scheduled_change?.action === 'cancel') {
        sub.cancelAtPeriodEnd = true;
        sub.autoRenew = false;
        if (data.scheduled_change.effective_at) {
          sub.endDate = new Date(data.scheduled_change.effective_at);
        }
      } else if (!data.scheduled_change) {
        sub.cancelAtPeriodEnd = false;
        sub.autoRenew = true;
      }

      // If items changed, update planId
      const newPriceId = data.items?.[0]?.price?.id;
      if (newPriceId) {
        const plan =
          (await this.appPlansService.appPlanModel
            .findOne({
              'paddlePriceIds.monthly': newPriceId,
            })
            .exec()) ||
          (await this.appPlansService.appPlanModel
            .findOne({
              'paddlePriceIds.yearly': newPriceId,
            })
            .exec());

        if (plan) {
          sub.planId = plan.planId;
          sub.billingCycle =
            data.items[0].price.billing_cycle?.interval === 'year'
              ? 'yearly'
              : 'monthly';
        }
      }

      await sub.save();
      this.logger.log(
        `Subscription update synced: ${paddleSubscriptionId}, status=${status}, cancelAtPeriodEnd=${sub.cancelAtPeriodEnd}`,
      );
    } catch (error) {
      this.logger.error('Failed to handle subscription.updated', error);
    }
  }

  private async handleSubscriptionCanceled(data: any) {
    try {
      const paddleSubscriptionId = data.id;

      await this.appSubscriptionService['subscriptionModel'].updateOne(
        { paddleSubscriptionId },
        { status: 'cancelled', endDate: new Date() },
      );

      this.logger.log(
        `Subscription canceled in Paddle: ${paddleSubscriptionId}`,
      );
    } catch (error) {
      this.logger.error('Failed to handle subscription.canceled', error);
    }
  }
}
