import {
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  AppPlan,
  AppSubscription,
  AppSubscriptionBillingCycle,
  ChargilyUpgradePreviewData,
  SupportedCurrency,
} from '@ahmedrioueche/gympro-client';
import {
  ChargilyClient,
  UpdatePriceParams,
  UpdateProductParams,
} from '@chargily/chargily-pay';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';

export interface ChargilyCheckoutResult {
  checkout_url: string;
  checkout_id: string;
}

export interface ChargilyUpgradePreviewResult {
  preview: ChargilyUpgradePreviewData;
  target_plan: {
    planId: string;
    name: string;
    level: string;
  };
  billing_cycle: string;
  is_upgrade?: boolean;
  is_switch_up?: boolean;
  current_plan?: {
    planId: string;
    name: string;
    level: string;
  };
  current_billing_cycle?: AppSubscriptionBillingCycle;
}

@Injectable()
export class ChargilyService {
  private readonly logger = new Logger(ChargilyService.name);
  private client: ChargilyClient;
  private readonly apiKey: string;
  private readonly mode: 'test' | 'live';

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AppSubscriptionService))
    private readonly appSubscriptionService: AppSubscriptionService,
    private readonly appPlansService: AppPlansService,
  ) {
    this.apiKey = this.configService.get<string>('CHARGILY_SECRET_KEY') || '';
    this.mode =
      (this.configService.get<string>('CHARGILY_MODE') as 'test' | 'live') ||
      'test';

    this.client = new ChargilyClient({
      api_key: this.apiKey,
      mode: this.mode,
    });

    this.logger.log(
      `Chargily Config: MODE=${this.mode}, API_KEY=${this.apiKey ? 'PRESENT' : 'MISSING'}`,
    );

    if (!this.apiKey) {
      this.logger.warn('CHARGILY_SECRET_KEY is not configured');
    }
  }

  // ==================== Product & Price Management ====================

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
    address?: {
      country: string;
      state: string;
      address: string;
    };
    metadata?: Record<string, any>;
  }) {
    try {
      this.logger.log(`Creating customer: ${customerData.email}`);
      return await this.client.createCustomer(customerData);
    } catch (error) {
      this.logger.error('Failed to create customer', error);
      throw new BadRequestException('Failed to create customer in Chargily');
    }
  }

  async createProduct(productData: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, any>;
  }) {
    try {
      this.logger.log(`Creating product: ${productData.name}`);
      return await this.client.createProduct(productData);
    } catch (error) {
      this.logger.error('Failed to create product', error);
      throw new BadRequestException('Failed to create product in Chargily');
    }
  }

  async createPrice(priceData: {
    amount: number;
    currency: string;
    product_id: string;
    metadata?: Record<string, any>;
  }) {
    try {
      this.logger.log(
        `Creating price: ${priceData.amount} ${priceData.currency} for product ${priceData.product_id}`,
      );
      return await this.client.createPrice(priceData);
    } catch (error) {
      this.logger.error('Failed to create price', error);
      throw new BadRequestException('Failed to create price in Chargily');
    }
  }

  async listProducts(perPage?: number) {
    try {
      return await this.client.listProducts(perPage);
    } catch (error) {
      this.logger.error('Failed to list products', error);
      throw new BadRequestException('Failed to list products from Chargily');
    }
  }

  async updateProduct(productId: string, productData: UpdateProductParams) {
    try {
      this.logger.log(`Updating product: ${productId}`);
      return await this.client.updateProduct(productId, productData);
    } catch (error) {
      this.logger.error('Failed to update product', error);
      throw new BadRequestException('Failed to update product in Chargily');
    }
  }

  async deleteProduct(productId: string) {
    try {
      this.logger.log(`Deleting product: ${productId}`);
      return await this.client.deleteProduct(productId);
    } catch (error) {
      this.logger.error('Failed to delete product', error);
      throw new BadRequestException('Failed to delete product in Chargily');
    }
  }

  async listPrices(perPage?: number) {
    try {
      return await this.client.listPrices(perPage);
    } catch (error) {
      this.logger.error('Failed to list prices', error);
      throw new BadRequestException('Failed to list prices from Chargily');
    }
  }

  async updatePrice(priceId: string, priceData: UpdatePriceParams) {
    try {
      this.logger.log(`Updating price: ${priceId}`);
      return await this.client.updatePrice(priceId, priceData);
    } catch (error) {
      this.logger.error('Failed to update price', error);
      throw new BadRequestException('Failed to update price in Chargily');
    }
  }

  // ==================== Checkout Management ====================

  async createCheckout(checkoutData: {
    items?: Array<{ price: string; quantity: number }>;
    amount?: number;
    currency?: string;
    success_url: string;
    failure_url: string;
    payment_method?: 'edahabia' | 'cib';
    locale?: 'ar' | 'en' | 'fr';
    pass_fees_to_customer?: boolean;
    customer_id?: string;
    shipping_address?: string;
    collect_shipping_address?: boolean;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<ChargilyCheckoutResult> {
    try {
      this.logger.log(
        `Creating checkout: ${checkoutData.description || 'No description'}`,
      );

      const checkout = await this.client.createCheckout(checkoutData as any);

      this.logger.log(
        `Checkout created: id=${checkout.id}, url=${checkout.checkout_url}`,
      );

      return {
        checkout_url: checkout.checkout_url,
        checkout_id: checkout.id,
      };
    } catch (error) {
      this.logger.error(
        'Failed to create checkout',
        error.response?.data || error,
      );
      throw new BadRequestException('Failed to create checkout in Chargily');
    }
  }

  async getCheckout(checkoutId: string) {
    try {
      this.logger.log(`Fetching checkout: ${checkoutId}`);
      return await this.client.getCheckout(checkoutId);
    } catch (error) {
      this.logger.error('Failed to get checkout', error);
      throw new BadRequestException(
        'Failed to retrieve checkout from Chargily',
      );
    }
  }

  async createPaymentLink(paymentLinkData: {
    name: string;
    items: Array<{
      price: string;
      quantity: number;
      adjustable_quantity?: boolean;
    }>;
    after_completion_message?: string;
    locale?: 'ar' | 'en' | 'fr';
    pass_fees_to_customer?: boolean;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  }) {
    try {
      this.logger.log(`Creating payment link: ${paymentLinkData.name}`);
      return await this.client.createPaymentLink(paymentLinkData);
    } catch (error) {
      this.logger.error('Failed to create payment link', error);
      throw new BadRequestException(
        'Failed to create payment link in Chargily',
      );
    }
  }

  // ==================== Subscription Checkout ====================

  async createSubscriptionCheckout(
    userId: string,
    planId: string,
    billingCycle: AppSubscriptionBillingCycle,
    userLocale: 'ar' | 'en' | 'fr',
    frontendUrl: string,
  ): Promise<ChargilyCheckoutResult> {
    try {
      this.logger.log(
        `🚀 [SUBSCRIPTION] Creating checkout for user=${userId}, plan=${planId}, billing=${billingCycle}`,
      );

      // Fetch plan details from database
      const plan = await this.appPlansService.getPlanByPlanId(planId);

      if (!plan) {
        this.logger.error(`❌ [SUBSCRIPTION] Plan not found: ${planId}`);
        throw new BadRequestException('Plan not found');
      }

      // Calculate the amount with proration if user has active subscription
      const amount = await this.calculateCheckoutAmount(
        userId,
        plan,
        billingCycle,
        'DZD',
      );

      this.logger.log(`💰 [SUBSCRIPTION] Calculated amount: ${amount} DZD`);

      if (!amount || amount === 0) {
        this.logger.error(
          `❌ [SUBSCRIPTION] Invalid amount for plan=${planId}, billing=${billingCycle}`,
        );
        throw new BadRequestException(
          'Price not available for this billing cycle',
        );
      }

      // Create checkout directly with amount
      const result = await this.createCheckout({
        amount: amount,
        currency: 'dzd',
        success_url: `${frontendUrl}/payment/success`,
        failure_url: `${frontendUrl}/payment/failure`,
        payment_method: 'edahabia',
        locale: userLocale,
        description: `${plan.name} - ${billingCycle}`,
        metadata: {
          userId,
          planId: plan.planId,
          billingCycle,
          type: 'subscription',
        },
      });

      this.logger.log(
        `✅ [SUBSCRIPTION] Checkout created: ${result.checkout_id}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ [SUBSCRIPTION] Failed to create checkout`,
        error.message,
      );
      throw error;
    }
  }

  // ==================== Upgrade Preview ====================

  async previewUpgrade(
    userId: string,
    planId: string,
    billingCycle: AppSubscriptionBillingCycle,
  ): Promise<ChargilyUpgradePreviewResult> {
    try {
      this.logger.log(
        `📋 [PREVIEW] User=${userId}, TargetPlan=${planId}, Billing=${billingCycle}`,
      );

      // Fetch target plan details
      const targetPlan = await this.appPlansService.getPlanByPlanId(planId);

      if (!targetPlan) {
        this.logger.error(`❌ [PREVIEW] Target plan not found: ${planId}`);
        throw new BadRequestException('Plan not found');
      }

      // Get target plan price
      const targetPrice = this.getPlanAmount(targetPlan, billingCycle, 'DZD');

      if (!targetPrice) {
        this.logger.error(
          `❌ [PREVIEW] Price not configured for plan=${planId}, billing=${billingCycle}`,
        );
        throw new BadRequestException(
          'Price not available for this billing cycle',
        );
      }

      // Check for existing active subscription
      const currentSub =
        await this.appSubscriptionService.getMySubscription(userId);

      // No existing subscription - full price, no proration
      if (!currentSub) {
        this.logger.log(
          `📋 [PREVIEW] No existing subscription - full price: ${targetPrice} DZD`,
        );

        const previewData: ChargilyUpgradePreviewData = {
          immediate_transaction: {
            details: {
              totals: {
                total: targetPrice.toString(),
                subtotal: targetPrice.toString(),
                credit: '0',
                balance: '0',
              },
              line_items: [
                {
                  totals: {
                    total: targetPrice.toString(),
                    subtotal: targetPrice.toString(),
                  },
                },
              ],
            },
          },
          credit: '0',
          update_summary: {
            credit: {
              used: '0',
            },
            charge: {
              total: targetPrice.toString(),
            },
          },
        };

        return {
          preview: previewData,
          target_plan: {
            planId: targetPlan.planId,
            name: targetPlan.name,
            level: targetPlan.level,
          },
          billing_cycle: billingCycle,
        };
      }

      // Get current plan details
      const currentPlan = await this.appPlansService.getPlanByPlanId(
        currentSub.planId,
      );

      if (!currentPlan) {
        this.logger.error(
          `❌ [PREVIEW] Current plan not found: ${currentSub.planId}`,
        );
        throw new BadRequestException('Current plan not found');
      }

      // Get current plan price
      const currentPrice = this.getPlanAmount(
        currentPlan,
        currentSub.billingCycle || 'monthly',
        'DZD',
      );

      if (!currentPrice) {
        this.logger.error(`❌ [PREVIEW] Current plan price not found`);
        throw new BadRequestException('Current plan price not found');
      }

      // Calculate proration credit
      const prorationCredit = await this.calculateProrationCredit(
        currentSub,
        currentPlan,
        'DZD',
      );

      this.logger.log(`💰 [PREVIEW] Proration credit: ${prorationCredit} DZD`);
      this.logger.log(
        `💰 [PREVIEW] Current price: ${currentPrice} DZD, Target price: ${targetPrice} DZD`,
      );

      // Determine if this is an upgrade based on price comparison
      // If target price is higher than or equal to current price, treat as immediate upgrade
      const isImmediateUpgrade = targetPrice >= currentPrice;

      // Also check traditional upgrade/switch up logic
      const currentLevelIndex = APP_PLAN_LEVELS.indexOf(currentPlan.level);
      const targetLevelIndex = APP_PLAN_LEVELS.indexOf(targetPlan.level);

      const currentCycleIndex = APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(
        currentSub.billingCycle || 'monthly',
      );
      const targetCycleIndex =
        APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(billingCycle);

      const isUpgrade = targetLevelIndex > currentLevelIndex;
      const isSwitchUp =
        targetLevelIndex === currentLevelIndex &&
        targetCycleIndex > currentCycleIndex;

      this.logger.log(
        `📋 [PREVIEW] CurrentPlan=${currentPlan.level}, TargetPlan=${targetPlan.level}, isUpgrade=${isUpgrade}, isSwitchUp=${isSwitchUp}, isImmediateUpgrade=${isImmediateUpgrade}`,
      );

      let immediateCharge: number;
      let creditUsed: number;

      if (isImmediateUpgrade || isUpgrade || isSwitchUp) {
        // Immediate change - apply proration credit
        creditUsed = prorationCredit;
        immediateCharge = Math.max(
          0,
          Math.round(targetPrice - prorationCredit),
        );
        this.logger.log(
          `✅ [PREVIEW] Immediate upgrade - Charge: ${immediateCharge} DZD`,
        );
      } else {
        // Downgrade/switch down - no proration, charged at period end
        creditUsed = 0;
        immediateCharge = 0;
        this.logger.log(
          `📉 [PREVIEW] Downgrade/SwitchDown - Deferred to period end`,
        );
      }

      const previewData: ChargilyUpgradePreviewData = {
        immediate_transaction:
          isImmediateUpgrade || isUpgrade || isSwitchUp
            ? {
                details: {
                  totals: {
                    total: immediateCharge.toString(),
                    subtotal: targetPrice.toString(),
                    credit: creditUsed.toString(),
                    balance: '0',
                  },
                  line_items: [
                    {
                      totals: {
                        total: targetPrice.toString(),
                        subtotal: targetPrice.toString(),
                      },
                      proration:
                        prorationCredit > 0
                          ? {
                              rate: (prorationCredit / targetPrice).toFixed(4),
                            }
                          : undefined,
                    },
                  ],
                },
              }
            : undefined,
        credit: creditUsed.toString(),
        update_summary: {
          credit: {
            used: creditUsed.toString(),
          },
          charge: {
            total: immediateCharge.toString(),
          },
        },
        next_transaction:
          !isImmediateUpgrade && !isUpgrade && !isSwitchUp
            ? {
                billing_period: {
                  starts_at: currentSub.currentPeriodEnd,
                  ends_at: new Date(
                    new Date(currentSub.currentPeriodEnd).getTime() +
                      (billingCycle === 'yearly' ? 365 : 30) *
                        24 *
                        60 *
                        60 *
                        1000,
                  ).toISOString(),
                },
                details: {
                  totals: {
                    total: targetPrice.toString(),
                    subtotal: targetPrice.toString(),
                  },
                },
              }
            : undefined,
      };

      return {
        preview: previewData,
        target_plan: {
          planId: targetPlan.planId,
          name: targetPlan.name,
          level: targetPlan.level,
        },
        billing_cycle: billingCycle,
        is_upgrade: isUpgrade || isImmediateUpgrade,
        is_switch_up: isSwitchUp,
        current_plan: {
          planId: currentPlan.planId,
          name: currentPlan.name,
          level: currentPlan.level,
        },
        current_billing_cycle: currentSub.billingCycle,
      };
    } catch (error) {
      this.logger.error(
        `❌ [PREVIEW] Failed to preview upgrade`,
        error.message,
      );
      throw error;
    }
  }

  // ==================== Upgrade ====================

  async createSubscriptionUpgradeCheckout(
    userId: string,
    planId: string,
    billingCycle: AppSubscriptionBillingCycle,
    userLocale: 'ar' | 'en' | 'fr',
    frontendUrl: string,
  ): Promise<ChargilyCheckoutResult> {
    try {
      this.logger.log(
        `🚀 [UPGRADE] Creating upgrade checkout for user=${userId}, plan=${planId}, billing=${billingCycle}`,
      );

      // Fetch target plan details
      const targetPlan = await this.appPlansService.getPlanByPlanId(planId);

      if (!targetPlan) {
        this.logger.error(`❌ [UPGRADE] Plan not found: ${planId}`);
        throw new BadRequestException('Plan not found');
      }

      // Get target plan price
      const targetPrice = this.getPlanAmount(targetPlan, billingCycle, 'DZD');

      if (!targetPrice) {
        this.logger.error(
          `❌ [UPGRADE] Price not configured for plan=${planId}, billing=${billingCycle}`,
        );
        throw new BadRequestException(
          'Price not available for this billing cycle',
        );
      }

      // Check for existing active subscription
      const currentSub =
        await this.appSubscriptionService.getMySubscription(userId);

      // No existing subscription - charge full price
      if (!currentSub) {
        this.logger.log(
          `📋 [UPGRADE] No existing subscription - charging full price: ${targetPrice} DZD`,
        );

        const result = await this.createCheckout({
          amount: targetPrice,
          currency: 'dzd',
          success_url: `${frontendUrl}/payment/success`,
          failure_url: `${frontendUrl}/payment/failure`,
          payment_method: 'edahabia',
          locale: userLocale,
          description: `${targetPlan.name} - ${billingCycle}`,
          metadata: {
            userId,
            planId: targetPlan.planId,
            billingCycle,
            type: 'subscription',
          },
        });

        return result;
      }

      // Get current plan details
      const currentPlan = await this.appPlansService.getPlanByPlanId(
        currentSub.planId,
      );

      if (!currentPlan) {
        this.logger.error(
          `❌ [UPGRADE] Current plan not found: ${currentSub.planId}`,
        );
        throw new BadRequestException('Current plan not found');
      }

      // Get current plan price
      const currentPrice = this.getPlanAmount(
        currentPlan,
        currentSub.billingCycle || 'monthly',
        'DZD',
      );

      if (!currentPrice) {
        this.logger.error(`❌ [UPGRADE] Current plan price not found`);
        throw new BadRequestException('Current plan price not found');
      }

      // Determine if this is an immediate upgrade (price-based)
      const isImmediateUpgrade = targetPrice >= currentPrice;

      // Also check traditional upgrade/switch up logic
      const currentLevelIndex = APP_PLAN_LEVELS.indexOf(currentPlan.level);
      const targetLevelIndex = APP_PLAN_LEVELS.indexOf(targetPlan.level);

      const currentCycleIndex = APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(
        currentSub.billingCycle || 'monthly',
      );
      const targetCycleIndex =
        APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(billingCycle);

      const isUpgrade = targetLevelIndex > currentLevelIndex;
      const isSwitchUp =
        targetLevelIndex === currentLevelIndex &&
        targetCycleIndex > currentCycleIndex;

      this.logger.log(
        `📋 [UPGRADE] CurrentPlan=${currentPlan.level}(${currentPrice} DZD), TargetPlan=${targetPlan.level}(${targetPrice} DZD)`,
      );
      this.logger.log(
        `📋 [UPGRADE] isUpgrade=${isUpgrade}, isSwitchUp=${isSwitchUp}, isImmediateUpgrade=${isImmediateUpgrade}`,
      );

      // Only apply proration for immediate upgrades
      if (!isImmediateUpgrade && !isUpgrade && !isSwitchUp) {
        this.logger.log(
          `📉 [UPGRADE] Downgrade detected - changes will apply at period end`,
        );
        throw new BadRequestException(
          'Downgrades are processed at the end of the current billing period. No payment needed now.',
        );
      }

      // Calculate proration credit
      const prorationCredit = await this.calculateProrationCredit(
        currentSub,
        currentPlan,
        'DZD',
      );

      this.logger.log(`💰 [UPGRADE] Proration credit: ${prorationCredit} DZD`);

      // Calculate final charge amount
      const immediateCharge = Math.max(
        0,
        Math.round(targetPrice - prorationCredit),
      );

      this.logger.log(
        `💰 [UPGRADE] Final charge amount: ${immediateCharge} DZD`,
      );

      // Create checkout with prorated amount
      const result = await this.createCheckout({
        amount: immediateCharge,
        currency: 'dzd',
        success_url: `${frontendUrl}/payment/success`,
        failure_url: `${frontendUrl}/payment/failure`,
        payment_method: 'edahabia',
        locale: userLocale,
        description: `Upgrade to ${targetPlan.name} - ${billingCycle}`,
        metadata: {
          userId,
          planId: targetPlan.planId,
          billingCycle,
          type: 'subscription',
          isUpgrade: true,
          previousPlanId: currentPlan.planId,
          prorationCredit: prorationCredit.toString(),
        },
      });

      this.logger.log(`✅ [UPGRADE] Checkout created: ${result.checkout_id}`);

      return result;
    } catch (error) {
      this.logger.error(
        `❌ [UPGRADE] Failed to create checkout`,
        error.message,
      );
      throw error;
    }
  }

  async createRenewalCheckout(
    userId: string,
    billingCycle?: AppSubscriptionBillingCycle,
    userLocale: 'ar' | 'en' | 'fr' = 'en',
    frontendUrl?: string,
  ): Promise<ChargilyCheckoutResult> {
    try {
      this.logger.log(
        `🔄 [RENEWAL] Creating renewal checkout for user=${userId}, billing=${billingCycle || 'current'}`,
      );

      // Get existing subscription
      const subscription =
        await this.appSubscriptionService.getMySubscription(userId);

      if (!subscription) {
        throw new BadRequestException('No active subscription found to renew');
      }

      // Check if subscription can be renewed
      if (
        subscription.status === 'cancelled' ||
        subscription.cancelAtPeriodEnd
      ) {
        throw new BadRequestException(
          'Cannot renew a cancelled subscription. Please reactivate first.',
        );
      }

      // For Paddle subscriptions, they auto-renew
      if (
        subscription.provider === 'paddle' &&
        subscription.paddleSubscriptionId
      ) {
        throw new BadRequestException(
          'Paddle subscriptions renew automatically. Please ensure auto-renewal is enabled.',
        );
      }

      // Get plan details
      const plan = await this.appPlansService.getPlanByPlanId(
        subscription.planId,
      );

      if (!plan) {
        throw new BadRequestException('Subscription plan not found');
      }

      // Use provided billing cycle or keep current one
      const renewalBillingCycle =
        billingCycle || subscription.billingCycle || 'monthly';

      // Calculate renewal price
      const price = this.getPlanAmount(plan, renewalBillingCycle, 'DZD');

      if (!price) {
        throw new BadRequestException(
          `Price not available for ${renewalBillingCycle} billing cycle`,
        );
      }

      this.logger.log(`💰 [RENEWAL] Renewal price: ${price} DZD`);

      // Create checkout with renewal metadata
      const result = await this.createCheckout({
        amount: price,
        currency: 'dzd',
        success_url: `${frontendUrl}/payment/success`,
        failure_url: `${frontendUrl}/payment/failure`,
        payment_method: 'edahabia',
        locale: userLocale,
        description: `${plan.name} - Renewal (${renewalBillingCycle})`,
        metadata: {
          type: 'subscription_renewal',
          userId,
          subscriptionId: subscription._id.toString(),
          planId: subscription.planId,
          billingCycle: renewalBillingCycle,
        },
      });

      this.logger.log(`✅ [RENEWAL] Checkout created: ${result.checkout_id}`);

      return result;
    } catch (error) {
      this.logger.error(
        `❌ [RENEWAL] Failed to create renewal checkout`,
        error.message,
      );
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Calculate the checkout amount with proration for upgrades/switches
   */
  private async calculateCheckoutAmount(
    userId: string,
    targetPlan: AppPlan,
    targetBillingCycle: AppSubscriptionBillingCycle,
    currency: SupportedCurrency,
  ): Promise<number | null> {
    // Get base price for target plan
    const targetPrice = this.getPlanAmount(
      targetPlan,
      targetBillingCycle,
      currency,
    );

    if (!targetPrice) {
      return null;
    }

    // Check for existing active subscription
    const currentSub =
      await this.appSubscriptionService.getMySubscription(userId);

    if (!currentSub) {
      // No existing subscription, return full price
      return targetPrice;
    }

    // Get current plan details
    const currentPlan = await this.appPlansService.getPlanByPlanId(
      currentSub.planId,
    );

    if (!currentPlan) {
      // Can't find current plan, return full price
      return targetPrice;
    }

    // Determine if this is an upgrade/switch up or downgrade/switch down
    const currentLevelIndex = APP_PLAN_LEVELS.indexOf(currentPlan.level);
    const targetLevelIndex = APP_PLAN_LEVELS.indexOf(targetPlan.level);

    const currentCycleIndex = APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(
      currentSub.billingCycle || 'monthly',
    );
    const targetCycleIndex =
      APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(targetBillingCycle);

    const isUpgrade = targetLevelIndex > currentLevelIndex;
    const isSwitchUp =
      targetLevelIndex === currentLevelIndex &&
      targetCycleIndex > currentCycleIndex;

    // Only calculate proration for upgrades and switch ups (immediate changes)
    if (!isUpgrade && !isSwitchUp) {
      // For downgrades/switch downs, return full price (they'll be charged at period end)
      return targetPrice;
    }

    // Calculate proration credit from current subscription
    const prorationCredit = await this.calculateProrationCredit(
      currentSub,
      currentPlan,
      currency,
    );

    // Return prorated amount (can't go below 0)
    return Math.max(0, Math.round(targetPrice - prorationCredit));
  }

  /**
   * Calculate proration credit from current subscription
   */
  private async calculateProrationCredit(
    currentSub: AppSubscription,
    currentPlan: AppPlan,
    currency: SupportedCurrency,
  ): Promise<number> {
    // Don't give credit for trial subscriptions
    if (currentSub.status === 'trialing') {
      return 0;
    }

    const periodStart = currentSub.currentPeriodStart || currentSub.startDate;
    const periodEnd = currentSub.currentPeriodEnd;
    const nowTime = new Date().getTime();
    const startTime = new Date(periodStart).getTime();
    const endTime = new Date(periodEnd).getTime();
    const totalDuration = endTime - startTime;
    const elapsed = nowTime - startTime;

    if (totalDuration <= 0) {
      return 0;
    }

    // Calculate remaining time ratio
    const remainingTime = Math.max(0, totalDuration - elapsed);
    const ratio = remainingTime / totalDuration;

    // Get current plan price
    const currentPrice = this.getPlanAmount(
      currentPlan,
      currentSub.billingCycle || 'monthly',
      currency,
    );

    if (!currentPrice) {
      return 0;
    }

    // Return prorated credit
    return currentPrice * ratio;
  }

  private getPlanAmount(
    plan: AppPlan,
    billingCycle?: AppSubscriptionBillingCycle,
    currency: SupportedCurrency = 'DZD',
  ): number | null {
    const pricing = plan.pricing?.[currency];

    if (!pricing) {
      return null;
    }

    if (billingCycle === 'yearly' && pricing.yearly) {
      return pricing.yearly;
    }

    if (billingCycle === 'monthly' && pricing.monthly) {
      return pricing.monthly;
    }

    return null;
  }

  // ==================== Webhook Handlers ====================

  async handleCheckoutPaid(data: any): Promise<void> {
    this.logger.log(`💰 [WEBHOOK] Payment successful: ${data.id}`);

    try {
      const metadata = data.metadata;

      if (!metadata?.type) {
        this.logger.log('No metadata type, skipping');
        return;
      }

      switch (metadata.type) {
        case 'subscription_renewal':
          await this.handleSubscriptionRenewal(data, metadata);
          break;
        case 'subscription':
          await this.handleNewSubscription(data, metadata);
          break;
        default:
          this.logger.log('Unhandled checkout type:', metadata.type);
      }
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Error handling successful payment',
        error,
      );
    }
  }

  private async handleSubscriptionRenewal(
    checkoutData: any,
    metadata: any,
  ): Promise<void> {
    this.logger.log('🔄 [WEBHOOK] Processing subscription renewal:', metadata);

    try {
      const { userId, billingCycle } = metadata;

      if (!userId) {
        this.logger.error('❌ [WEBHOOK] Missing userId in renewal metadata');
        return;
      }

      // Renew subscription with new period dates
      await this.appSubscriptionService.renewSubscription(userId, billingCycle);

      this.logger.log(`✅ [WEBHOOK] Subscription renewed for user ${userId}`);
    } catch (error) {
      this.logger.error(
        '❌ [WEBHOOK] Failed to process renewal:',
        error.message,
      );
      throw error;
    }
  }

  private async handleNewSubscription(
    checkoutData: any,
    metadata: any,
  ): Promise<void> {
    const { userId, planId, billingCycle } = metadata;

    if (!userId || !planId) {
      this.logger.error('❌ [WEBHOOK] Missing userId or planId in metadata');
      return;
    }

    this.logger.log(
      `🔄 [WEBHOOK] Activating subscription for user=${userId}, plan=${planId}`,
    );

    await this.appSubscriptionService.subscribe(
      userId,
      planId,
      billingCycle || 'monthly',
      'DZD',
      'chargily',
    );

    this.logger.log(
      `✅ [WEBHOOK] Subscription activated for user ${userId} with plan ${planId}`,
    );
  }

  async handleCheckoutFailed(data: any): Promise<void> {
    this.logger.log(`❌ [WEBHOOK] Payment failed: ${data.id}`);

    try {
      if (data.metadata?.userId) {
        this.logger.log(
          `⚠️ [WEBHOOK] Payment failed for user ${data.metadata.userId}`,
        );
      }
      // TODO: Notify user about failed payment, log in database, etc.
    } catch (error) {
      this.logger.error('❌ [WEBHOOK] Error handling failed payment', error);
    }
  }

  getClient() {
    return this.client;
  }
}
