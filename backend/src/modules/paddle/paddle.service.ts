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

      // ✅ Immediately sync cancellation to local DB
      await this.appSubscriptionService.subscriptionModel.updateOne(
        { paddleSubscriptionId: subscriptionId },
        {
          cancelAtPeriodEnd: true,
          autoRenew: false,
        },
      );

      this.logger.log(
        `✅ [CANCEL] Subscription cancelled and DB synced: ${subscriptionId}`,
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

  async removeScheduledCancellation(subscriptionId: string) {
    try {
      this.logger.log(
        `🔄 [REACTIVATION] Removing scheduled cancellation: ${subscriptionId}`,
      );

      // Check current subscription state in Paddle
      const currentState = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const subscription = currentState.data.data;

      // If no scheduled cancellation, nothing to do
      if (subscription.scheduled_change?.action !== 'cancel') {
        this.logger.log(
          `✅ [REACTIVATION] No cancellation scheduled for: ${subscriptionId}`,
        );
        return { reactivated: false, reason: 'no_cancellation_scheduled' };
      }

      // Remove the scheduled cancellation via Paddle API
      await axios.delete(
        `${this.apiUrl}/subscriptions/${subscriptionId}/scheduled-changes`,
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

      // ✅ Immediately update local database
      await this.appSubscriptionService.subscriptionModel.updateOne(
        { paddleSubscriptionId: subscriptionId },
        {
          cancelAtPeriodEnd: false,
          autoRenew: true,
          cancelledAt: undefined,
          cancellationReason: undefined,
          status: 'active',
        },
      );

      this.logger.log(`✅ [REACTIVATION] Local DB synced: ${subscriptionId}`);

      return { reactivated: true };
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
   * ✅ Immediately sync subscription from Paddle after upgrade
   * This ensures the UI updates right away without waiting for webhooks
   */
  private async syncSubscriptionImmediately(
    paddleSubscriptionId: string,
    expectedPriceId: string,
  ) {
    try {
      this.logger.log(
        `🔄 [IMMEDIATE SYNC] Fetching subscription from Paddle: ${paddleSubscriptionId}`,
      );

      // Fetch latest data from Paddle API
      const response = await axios.get(
        `${this.apiUrl}/subscriptions/${paddleSubscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const paddleData = response.data.data;

      // Find local subscription record
      const sub = await this.appSubscriptionService.subscriptionModel
        .findOne({ paddleSubscriptionId })
        .exec();

      if (!sub) {
        this.logger.error(
          `❌ [IMMEDIATE SYNC] Local subscription not found: ${paddleSubscriptionId}`,
        );
        return;
      }

      const oldPlanId = sub.planId;
      const oldBillingCycle = sub.billingCycle;

      // Get the new price ID from Paddle's subscription items
      const newPriceId = paddleData.items?.[0]?.price?.id;

      this.logger.log(
        `📊 [IMMEDIATE SYNC] Price comparison: current=${newPriceId}, expected=${expectedPriceId}, match=${newPriceId === expectedPriceId}`,
      );

      if (!newPriceId) {
        this.logger.warn('[IMMEDIATE SYNC] No price ID found in Paddle data');
        return;
      }

      // Find the plan that matches this price ID
      const newPlan =
        (await this.appPlansService.appPlanModel
          .findOne({ 'paddlePriceIds.monthly': newPriceId })
          .exec()) ||
        (await this.appPlansService.appPlanModel
          .findOne({ 'paddlePriceIds.yearly': newPriceId })
          .exec()) ||
        (await this.appPlansService.appPlanModel
          .findOne({ 'paddlePriceIds.oneTime': newPriceId })
          .exec());

      if (!newPlan) {
        this.logger.error(
          `❌ [IMMEDIATE SYNC] Could not find plan for price: ${newPriceId}`,
        );
        return;
      }

      // Update plan and billing cycle
      sub.planId = newPlan.planId;
      sub.billingCycle =
        paddleData.items[0].price.billing_cycle?.interval === 'year'
          ? 'yearly'
          : paddleData.items[0].price.billing_cycle?.interval === 'month'
            ? 'monthly'
            : 'oneTime';

      // Update status
      const status = paddleData.status;
      if (status === 'active' || status === 'trialing') {
        sub.status = 'active';
      } else if (status === 'past_due') {
        sub.status = 'active';
      } else {
        sub.status = 'cancelled';
      }

      // Update billing periods
      if (paddleData.current_billing_period) {
        sub.currentPeriodStart = new Date(
          paddleData.current_billing_period.starts_at,
        );
        sub.currentPeriodEnd = new Date(
          paddleData.current_billing_period.ends_at,
        );
        if (sub.status === 'active') {
          sub.endDate = sub.currentPeriodEnd;
        }
      }

      // Update next payment date
      if (paddleData.next_billed_at) {
        sub.nextPaymentDate = new Date(paddleData.next_billed_at);
      }

      // Update last payment date
      sub.lastPaymentDate = new Date();

      // Reset cancellation flags (upgrade reactivates subscription)
      sub.cancelAtPeriodEnd = false;
      sub.autoRenew = true;
      sub.cancelledAt = undefined;
      sub.cancellationReason = undefined;

      // Handle scheduled changes
      if (paddleData.scheduled_change?.action === 'cancel') {
        sub.cancelAtPeriodEnd = true;
        sub.autoRenew = false;
        if (paddleData.scheduled_change.effective_at) {
          sub.endDate = new Date(paddleData.scheduled_change.effective_at);
        }
      }

      await sub.save();

      this.logger.log(
        `✅ [IMMEDIATE SYNC] Subscription updated: ${oldPlanId}(${oldBillingCycle}) → ${sub.planId}(${sub.billingCycle})`,
      );

      return sub;
    } catch (error) {
      this.logger.error(
        `❌ [IMMEDIATE SYNC] Failed to sync subscription`,
        error.response?.data || error,
      );
      // Don't throw - webhook will handle it as backup
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

      // Call Paddle API to update subscription
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

      // ✅ CRITICAL: Immediately sync the local database from Paddle
      // Don't wait for webhooks - they may be delayed or arrive out of order
      this.logger.log(`🔄 [UPGRADE] Syncing local database immediately...`);
      await this.syncSubscriptionImmediately(subscriptionId, priceId);

      // ✅ Case 1: No immediate transaction (fully covered by credit or no payment needed)
      if (!transaction) {
        this.logger.log(
          `✅ [UPGRADE] Success - No payment needed (covered by credit)`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
        };
      }

      // ✅ Case 2: Transaction created but payment succeeded immediately
      if (transaction.status === 'completed') {
        this.logger.log(
          `✅ [UPGRADE] Success - Payment completed: txn=${transaction.id}`,
        );
        return {
          success: true,
          message: 'Upgrade applied immediately',
          transaction_id: transaction.id,
        };
      }

      // ✅ Case 3: Payment requires action (e.g., 3DS authentication, new payment method)
      if (transaction.checkout?.url) {
        this.logger.log(
          `⚠️ [UPGRADE] Payment required: txn=${transaction.id}, url=${transaction.checkout.url}`,
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
        `⏳ [UPGRADE] Transaction pending: txn=${transaction.id}, status=${transaction.status}`,
      );
      return {
        success: false,
        transaction_id: transaction.id,
        message: 'Payment pending',
      };
    } catch (error) {
      this.logger.error(
        `❌ [UPGRADE] Failed to create upgrade transaction`,
        error.response?.data || error.message,
      );

      // Log more details for debugging
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
    // ✅ FIX: Use event_id, not event.id
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
        this.logger.log(
          `📝 [WEBHOOK] Transaction created: txn=${event.data.id} - Ignoring (waiting for completion)`,
        );
        // No action needed - we process on transaction.completed
        break;

      case 'transaction.updated':
        this.logger.log(
          `📝 [WEBHOOK] Transaction updated: txn=${event.data.id} - Ignoring (waiting for completion)`,
        );
        // No action needed - we process on transaction.completed
        break;

      case 'transaction.billed':
        this.logger.log(
          `💳 [WEBHOOK] Transaction billed: txn=${event.data.id} - Ignoring (waiting for completion)`,
        );
        // No action needed - we process on transaction.completed
        break;

      case 'transaction.paid':
        this.logger.log(
          `💵 [WEBHOOK] Transaction paid: txn=${event.data.id} - Ignoring (waiting for completion)`,
        );
        // No action needed - we process on transaction.completed
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
   * ✅ FIXED: Handle transaction.completed webhook
   * Now ignores upgrade transactions and only processes NEW subscriptions
   */
  private async handleTransactionCompleted(data: any) {
    try {
      const customData = data.custom_data;
      const paddleSubscriptionId = data.subscription_id;

      this.logger.log(
        `💰 [WEBHOOK] Transaction completed: id=${data.id}, status=${data.status}, hasCustomData=${!!customData}, subscription=${paddleSubscriptionId}`,
      );

      // ✅ Check if this subscription already exists (upgrade scenario)
      if (paddleSubscriptionId) {
        const existingSub = await this.appSubscriptionService.subscriptionModel
          .findOne({ paddleSubscriptionId })
          .exec();

        if (existingSub) {
          this.logger.log(
            `⚠️ [WEBHOOK] Subscription already exists: ${paddleSubscriptionId} - This is an upgrade/renewal transaction, ignoring (subscription.updated will handle it)`,
          );
          return; // ✅ Don't process - let subscription.updated handle upgrades
        }
      }

      // ✅ This is a NEW subscription (initial checkout)
      if (!customData?.userId || !customData?.planId) {
        this.logger.error(
          `❌ [WEBHOOK] Missing custom_data or required fields in transaction ${data.id}. CustomData: ${JSON.stringify(customData)}`,
        );
        return;
      }

      const { userId, planId, billingCycle } = customData;
      const paddleCustomerId = data.customer_id;
      const currency = data.currency_code || 'USD';

      this.logger.log(
        `✅ [WEBHOOK] Activating NEW subscription → userId=${userId}, planId=${planId}, billingCycle=${billingCycle || 'monthly'}, provider=paddle, paddleSubId=${paddleSubscriptionId}`,
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
        `✅ [WEBHOOK] Subscription activated via Paddle → user=${userId}, plan=${planId}, subId=${paddleSubscriptionId}`,
      );
    } catch (error) {
      this.logger.error('❌ [WEBHOOK] Subscription activation failed', error);
      this.logger.error(`Error details: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Webhook handler for subscription.updated
   * This serves as a BACKUP mechanism in case immediate sync fails
   */
  private async handleSubscriptionUpdated(data: any) {
    try {
      this.logger.log(`🔔 [WEBHOOK] subscription.updated received: ${data.id}`);

      const paddleSubscriptionId = data.id;
      const status = data.status;
      const currentPeriodEnd = data.current_billing_period?.ends_at;

      const sub = await this.appSubscriptionService.subscriptionModel
        .findOne({ paddleSubscriptionId })
        .exec();

      if (!sub) {
        this.logger.warn(
          `⚠️ [WEBHOOK] Subscription not found: ${paddleSubscriptionId}`,
        );
        return;
      }

      const oldPlanId = sub.planId;
      const oldBillingCycle = sub.billingCycle;

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

      // Sync cancellation scheduled state
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
            .findOne({ 'paddlePriceIds.monthly': newPriceId })
            .exec()) ||
          (await this.appPlansService.appPlanModel
            .findOne({ 'paddlePriceIds.yearly': newPriceId })
            .exec());

        if (plan) {
          sub.planId = plan.planId;
          sub.billingCycle =
            data.items[0].price.billing_cycle?.interval === 'year'
              ? 'yearly'
              : 'monthly';

          if (
            oldPlanId !== sub.planId ||
            oldBillingCycle !== sub.billingCycle
          ) {
            this.logger.log(
              `🔄 [WEBHOOK] Plan updated: ${oldPlanId}(${oldBillingCycle}) → ${sub.planId}(${sub.billingCycle})`,
            );
          }
        }
      }

      await sub.save();

      this.logger.log(
        `✅ [WEBHOOK] Subscription synced: ${paddleSubscriptionId}, status=${status}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Failed to handle subscription.updated',
        error,
      );
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
        `✅ [WEBHOOK] Subscription canceled in Paddle: ${paddleSubscriptionId}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Failed to handle subscription.canceled',
        error,
      );
    }
  }
}
