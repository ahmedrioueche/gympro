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

// ✅ Return type for Paddle subscription data
export interface PaddleSubscriptionData {
  paddleSubscriptionId: string;
  status: string;
  planId?: string;
  billingCycle?: AppSubscriptionBillingCycle;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  nextPaymentDate?: Date;
  cancelAtPeriodEnd?: boolean;
  scheduledCancellationDate?: Date;
  priceId?: string;
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
    const plan = await this.appPlansService.getPlanByPlanId(planId);
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    if (!plan.paddleProductId || !plan.paddlePriceIds) {
      throw new BadRequestException(
        `Paddle configuration missing for plan: ${planId}`,
      );
    }

    const priceId = this.getPaddlePriceId(plan, billingCycle);
    if (!priceId) {
      throw new BadRequestException(
        `Price ID not found for plan=${planId}, billing=${billingCycle}`,
      );
    }

    this.logger.log(
      `Creating Paddle checkout → plan=${planId}, billing=${billingCycle}, price=${priceId}`,
    );

    return this.createCheckout(
      {
        items: [{ priceId, quantity: 1 }],
        customerId,
        customData: {
          planId,
          billingCycle,
          type: plan.type,
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
   * ✅ Cancel a subscription in Paddle (does NOT update database)
   * Returns the updated Paddle subscription state
   */
  async cancelSubscription(
    subscriptionId: string,
  ): Promise<PaddleSubscriptionData> {
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

      const data = response.data.data;
      return this.mapPaddleSubscriptionData(data);
    } catch (error) {
      this.logger.error(
        'Failed to cancel Paddle subscription',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to cancel subscription in Paddle');
    }
  }

  /**
   * ✅ Remove scheduled cancellation in Paddle (does NOT update database)
   * Returns the updated Paddle subscription state
   */
  async removeScheduledCancellation(
    subscriptionId: string,
  ): Promise<PaddleSubscriptionData> {
    try {
      this.logger.log(
        `🔄 [REACTIVATION] Removing scheduled cancellation: ${subscriptionId}`,
      );

      // Check current state
      const currentState = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const subscription = currentState.data.data;

      // If no scheduled cancellation, return current state
      if (subscription.scheduled_change?.action !== 'cancel') {
        this.logger.log(
          `✅ [REACTIVATION] No cancellation scheduled for: ${subscriptionId}`,
        );
        return this.mapPaddleSubscriptionData(subscription);
      }

      // PATCH the subscription with scheduled_change: null
      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          scheduled_change: null, // This removes the scheduled cancellation
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(
        `✅ [REACTIVATION] Cancellation removed in Paddle: ${subscriptionId}`,
      );

      // Return the updated subscription data from the response
      return this.mapPaddleSubscriptionData(response.data.data);
    } catch (error) {
      this.logger.error(
        `❌ [REACTIVATION] Failed to remove cancellation: ${subscriptionId}`,
        error.response?.data || error,
      );
      throw new BadRequestException(
        'Failed to reactivate subscription in Paddle',
      );
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

      // First, get the current subscription to check billing cycle
      const currentSub = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const currentPriceId = currentSub.data.data.items?.[0]?.price?.id;
      const currentBillingInterval =
        currentSub.data.data.items?.[0]?.price?.billing_cycle?.interval;

      // Get target price details
      const targetPriceResponse = await axios.get(
        `${this.apiUrl}/prices/${priceId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const targetBillingInterval =
        targetPriceResponse.data.data.billing_cycle?.interval;
      const isBillingCycleChange =
        currentBillingInterval !== targetBillingInterval;

      this.logger.log(
        `📋 [PREVIEW] Current billing: ${currentBillingInterval}, Target billing: ${targetBillingInterval}, isBillingCycleChange: ${isBillingCycleChange}`,
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
      const immediateTransaction = preview.immediate_transaction;
      const credit = preview.credit;

      // Calculate the actual amount to charge
      let amountDue = 0;
      if (immediateTransaction?.details?.totals) {
        amountDue = parseFloat(immediateTransaction.details.totals.total) || 0;
      }

      this.logger.log(
        `💰 [PREVIEW] Immediate charge: ${amountDue}, Credit: ${credit || 0}, isBillingCycleChange: ${isBillingCycleChange}`,
      );

      return {
        immediate_transaction: preview.immediate_transaction,
        next_transaction: preview.next_transaction,
        credit: preview.credit,
        update_summary: preview.update_summary,
        is_billing_cycle_change: isBillingCycleChange,
        current_billing_interval: currentBillingInterval,
        target_billing_interval: targetBillingInterval,
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
   * ✅ Fetch latest subscription data from Paddle (does NOT update database)
   * Returns normalized subscription data for the AppSubscriptionService to process
   */
  async fetchSubscriptionFromPaddle(
    paddleSubscriptionId: string,
  ): Promise<PaddleSubscriptionData> {
    try {
      this.logger.log(
        `🔄 [FETCH] Getting subscription from Paddle: ${paddleSubscriptionId}`,
      );

      const response = await axios.get(
        `${this.apiUrl}/subscriptions/${paddleSubscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return this.mapPaddleSubscriptionData(response.data.data);
    } catch (error) {
      this.logger.error(
        `❌ [FETCH] Failed to fetch subscription from Paddle`,
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to fetch subscription from Paddle');
    }
  }

  /**
   * ✅ Create an upgrade transaction in Paddle (does NOT update database)
   * Returns transaction result and updated subscription data
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
    subscriptionData?: PaddleSubscriptionData;
  }> {
    try {
      this.logger.log(
        `🚀 [UPGRADE] Starting upgrade: sub=${subscriptionId}, newPrice=${priceId}`,
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

      this.logger.log(
        `📡 [UPGRADE] Calling Paddle API: PATCH /subscriptions/${subscriptionId}`,
      );

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

      this.logger.log(
        `📦 [UPGRADE] Paddle response received: hasTransaction=${!!transaction}, transactionStatus=${transaction?.status || 'none'}`,
      );

      // ✅ Fetch updated subscription data from Paddle
      const subscriptionData =
        await this.fetchSubscriptionFromPaddle(subscriptionId);

      // Case 1: No immediate transaction (fully covered by credit)
      if (!transaction) {
        this.logger.log(
          `✅ [UPGRADE] Success - No payment needed (covered by credit)`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
          subscriptionData,
        };
      }

      // Case 2: Transaction completed immediately
      if (transaction.status === 'completed') {
        this.logger.log(
          `✅ [UPGRADE] Success - Payment completed: txn=${transaction.id}`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
          transaction_id: transaction.id,
          subscriptionData,
        };
      }

      // Case 3: Payment requires action
      if (transaction.checkout?.url) {
        this.logger.log(
          `⚠️ [UPGRADE] Payment required: txn=${transaction.id}, url=${transaction.checkout.url}`,
        );
        return {
          success: false,
          transaction_id: transaction.id,
          checkout_url: transaction.checkout.url,
          details: transaction.details,
          subscriptionData,
        };
      }

      // Case 4: Transaction pending
      this.logger.log(
        `⏳ [UPGRADE] Transaction pending: txn=${transaction.id}, status=${transaction.status}`,
      );
      return {
        success: false,
        transaction_id: transaction.id,
        message: 'Payment pending',
        subscriptionData,
      };
    } catch (error) {
      this.logger.error(
        `❌ [UPGRADE] Failed to create upgrade transaction`,
        error.response?.data || error.message,
      );

      if (error.response) {
        this.logger.error(
          `[UPGRADE] Response status: ${error.response.status}`,
        );
        this.logger.error(
          `[UPGRADE] Response data: ${JSON.stringify(error.response.data)}`,
        );
      }

      throw new BadRequestException('Failed to prepare upgrade in Paddle');
    }
  }

  /**
   * ✅ Schedule a downgrade in Paddle (applies at end of billing period)
   * For downgrades, we update the items but defer billing to next period
   */
  async scheduleDowngrade(
    subscriptionId: string,
    newPriceId: string,
    isBillingCycleChange: boolean = false,
  ): Promise<PaddleSubscriptionData> {
    try {
      this.logger.log(
        `📉 [DOWNGRADE] Scheduling downgrade: sub=${subscriptionId}, newPrice=${newPriceId}`,
      );

      // ✅ First, get current subscription to check for existing scheduled changes
      const currentSub = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      this.logger.log(
        `📋 [DOWNGRADE] Current subscription state: status=${currentSub.data.data.status}, has_scheduled_change=${!!currentSub.data.data.scheduled_change}`,
      );

      // ✅ Update subscription with proration_billing_mode set to defer charges
      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          items: [
            {
              price_id: newPriceId,
              quantity: 1,
            },
          ],
          proration_billing_mode: 'prorated_next_billing_period',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const updatedSub = response.data.data;

      this.logger.log(
        `✅ [DOWNGRADE] Downgrade applied in Paddle: ${subscriptionId}, scheduled_change=${JSON.stringify(updatedSub.scheduled_change)}`,
      );

      return this.mapPaddleSubscriptionData(updatedSub);
    } catch (error) {
      this.logger.error(
        `❌ [DOWNGRADE] Failed to schedule downgrade: ${subscriptionId}`,
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to schedule downgrade in Paddle');
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
   * ✅ Cancel a scheduled change in Paddle (removes pending downgrade/upgrade)
   * Returns the updated Paddle subscription state
   */
  async cancelScheduledChange(
    subscriptionId: string,
    originalPriceId: string, // Need this to revert back
  ): Promise<PaddleSubscriptionData> {
    try {
      this.logger.log(
        `🔄 [CANCEL_SCHEDULED] Reverting subscription to original plan: ${subscriptionId}`,
      );

      // Check current state
      const currentState = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const subscription = currentState.data.data;

      this.logger.log(
        `📋 [CANCEL_SCHEDULED] Current state: scheduled_change=${JSON.stringify(subscription.scheduled_change)}`,
      );

      // If there's a scheduled_change field, remove it
      if (subscription.scheduled_change) {
        const response = await axios.patch(
          `${this.apiUrl}/subscriptions/${subscriptionId}`,
          {
            scheduled_change: null,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );

        this.logger.log(
          `✅ [CANCEL_SCHEDULED] Scheduled change removed: ${subscriptionId}`,
        );

        return this.mapPaddleSubscriptionData(response.data.data);
      }

      // Otherwise, revert the items back to the original plan
      this.logger.log(
        `🔄 [CANCEL_SCHEDULED] No scheduled_change field - reverting items to original price: ${originalPriceId}`,
      );

      const response = await axios.patch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          items: [
            {
              price_id: originalPriceId,
              quantity: 1,
            },
          ],
          proration_billing_mode: 'do_not_bill',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(
        `✅ [CANCEL_SCHEDULED] Reverted to original plan: ${subscriptionId}`,
      );

      return this.mapPaddleSubscriptionData(response.data.data);
    } catch (error) {
      this.logger.error(
        `❌ [CANCEL_SCHEDULED] Failed to cancel scheduled change: ${subscriptionId}`,
        error.response?.data || error,
      );
      throw new BadRequestException(
        'Failed to cancel scheduled change in Paddle',
      );
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
   * ✅ Paddle webhook dispatcher - delegates DB updates to AppSubscriptionService
   */
  async handleWebhook(event: any) {
    this.logger.log(
      `🔔 [WEBHOOK] Received: type=${event.event_type}, event_id=${event.event_id}, occurred_at=${event.occurred_at}`,
    );

    switch (event.event_type) {
      case 'transaction.completed':
        this.logger.log(
          `💰 [WEBHOOK] Processing transaction.completed: txn=${event.data.id}`,
        );
        await this.handleTransactionCompleted(event.data);
        break;

      case 'transaction.created':
      case 'transaction.updated':
      case 'transaction.billed':
      case 'transaction.paid':
        this.logger.log(
          `📝 [WEBHOOK] ${event.event_type}: txn=${event.data.id} - Ignoring (waiting for completion)`,
        );
        break;

      case 'subscription.updated':
        this.logger.log(
          `🔄 [WEBHOOK] Processing subscription.updated: sub=${event.data.id}`,
        );
        await this.handleSubscriptionUpdated(event.data);
        break;

      case 'subscription.canceled':
        this.logger.log(
          `❌ [WEBHOOK] Processing subscription.canceled: sub=${event.data.id}`,
        );
        await this.handleSubscriptionCanceled(event.data);
        break;

      default:
        this.logger.warn(`⚠️ [WEBHOOK] Unhandled event: ${event.event_type}`);
    }
  }

  /**
   * ✅ Handle transaction.completed - delegates to AppSubscriptionService
   */
  private async handleTransactionCompleted(data: any) {
    try {
      const customData = data.custom_data;
      const paddleSubscriptionId = data.subscription_id;

      this.logger.log(
        `💰 [WEBHOOK] Transaction completed: id=${data.id}, status=${data.status}, subscription=${paddleSubscriptionId}`,
      );

      if (!paddleSubscriptionId) {
        this.logger.warn('No subscription_id in transaction, skipping');
        return;
      }

      // Delegate to AppSubscriptionService
      await this.appSubscriptionService.handlePaddleTransactionCompleted({
        transactionId: data.id,
        paddleSubscriptionId,
        customData,
        paddleCustomerId: data.customer_id,
        currency: data.currency_code,
      });
    } catch (error) {
      this.logger.error('❌ [WEBHOOK] Transaction processing failed', error);
    }
  }

  /**
   * ✅ Handle subscription.updated - delegates to AppSubscriptionService
   */
  private async handleSubscriptionUpdated(data: any) {
    try {
      this.logger.log(`🔔 [WEBHOOK] subscription.updated: ${data.id}`);

      const subscriptionData = this.mapPaddleSubscriptionData(data);
      await this.appSubscriptionService.syncFromPaddleData(subscriptionData);
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Failed to handle subscription.updated',
        error,
      );
    }
  }

  /**
   * ✅ Handle subscription.canceled - delegates to AppSubscriptionService
   */
  private async handleSubscriptionCanceled(data: any) {
    try {
      const subscriptionData = this.mapPaddleSubscriptionData(data);
      await this.appSubscriptionService.syncFromPaddleData(subscriptionData);

      this.logger.log(`✅ [WEBHOOK] Subscription canceled: ${data.id}`);
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Failed to handle subscription.canceled',
        error,
      );
    }
  }

  /**
   * ✅ Map Paddle subscription response to normalized data structure
   */
  private mapPaddleSubscriptionData(paddleData: any): PaddleSubscriptionData {
    const priceId = paddleData.items?.[0]?.price?.id;
    const billingInterval =
      paddleData.items?.[0]?.price?.billing_cycle?.interval;

    let billingCycle: AppSubscriptionBillingCycle = 'monthly';
    if (billingInterval === 'year') {
      billingCycle = 'yearly';
    } else if (billingInterval === 'month') {
      billingCycle = 'monthly';
    } else if (!billingInterval) {
      billingCycle = 'oneTime';
    }

    const scheduledChange = paddleData.scheduled_change;
    const cancelAtPeriodEnd = scheduledChange?.action === 'cancel';
    const scheduledCancellationDate = scheduledChange?.effective_at
      ? new Date(scheduledChange.effective_at)
      : undefined;

    return {
      paddleSubscriptionId: paddleData.id,
      status: paddleData.status,
      priceId,
      billingCycle,
      currentPeriodStart: paddleData.current_billing_period?.starts_at
        ? new Date(paddleData.current_billing_period.starts_at)
        : undefined,
      currentPeriodEnd: paddleData.current_billing_period?.ends_at
        ? new Date(paddleData.current_billing_period.ends_at)
        : undefined,
      nextPaymentDate: paddleData.next_billed_at
        ? new Date(paddleData.next_billed_at)
        : undefined,
      cancelAtPeriodEnd,
      scheduledCancellationDate,
    };
  }
}
