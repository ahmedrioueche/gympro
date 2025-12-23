import {
  apiResponse,
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  AppPlan,
  AppSubscription,
  AppSubscriptionBillingCycle,
  ErrorCode,
  SupportedCurrency,
} from '@ahmedrioueche/gympro-client';
import { verifySignature } from '@chargily/chargily-pay';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChargilyService } from './chargily.service';

@Controller('chargily')
export class ChargilyController {
  private readonly successUrl: string;
  private readonly failureUrl: string;
  constructor(
    private readonly userService: UsersService,
    private readonly chargilyService: ChargilyService,
    private readonly configService: ConfigService,
    private readonly appPlanService: AppPlansService,
    private readonly appSubscriptionService: AppSubscriptionService,
  ) {
    const frontendUrl =
      this.configService.get('NODE_ENV') === 'production'
        ? this.configService.get('PROD_FRONTEND_URL')
        : this.configService.get('DEV_FRONTEND_URL');

    this.successUrl =
      this.configService.get<string>('CHARGILY_SUCCESS_URL') ||
      `${frontendUrl}/payment/success`;
    this.failureUrl =
      this.configService.get<string>('CHARGILY_FAILURE_URL') ||
      `${frontendUrl}/payment/failure`;
  }

  @Post('checkout')
  async createCheckout(@Body() checkoutData: any) {
    try {
      const checkout = await this.chargilyService.createCheckout({
        items: checkoutData.items,
        success_url: this.successUrl,
        failure_url: this.failureUrl,
        payment_method: checkoutData.payment_method || 'edahabia',
        locale: checkoutData.locale || 'en',
        pass_fees_to_customer: checkoutData.pass_fees_to_customer || false,
        customer_id: checkoutData.customer_id,
        metadata: checkoutData.metadata,
      });

      return apiResponse(true, undefined, {
        checkout_url: checkout.checkout_url,
        checkout_id: checkout.id,
      });
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.CHECKOUT_CREATION_FAILED,
        undefined,
        error.message || 'Failed to create checkout',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout/subscription')
  async createSubscriptionCheckout(
    @Req() req: any,
    @Body()
    body: { planId: string; billingCycle?: AppSubscriptionBillingCycle },
  ) {
    try {
      const userId = req.user?.sub;
      const user = await this.userService.findById(userId);
      const { planId, billingCycle = 'monthly' } = body;

      // Fetch plan details from database
      const plan = await this.appPlanService.getPlanByPlanId(planId);

      if (!plan) {
        return apiResponse(
          false,
          ErrorCode.PLAN_NOT_FOUND,
          undefined,
          'Plan not found',
        );
      }

      // Calculate the amount with proration if user has active subscription
      const amount = await this.calculateCheckoutAmount(
        userId,
        plan,
        billingCycle,
        'DZD',
      );

      console.log({ amount });
      if (!amount || amount === 0) {
        return apiResponse(
          false,
          ErrorCode.PRICE_NOT_CONFIGURED,
          undefined,
          'Price not available for this billing cycle',
        );
      }

      const frontendUrl =
        this.configService.get('NODE_ENV') === 'production'
          ? this.configService.get('PROD_FRONTEND_URL')
          : this.configService.get('DEV_FRONTEND_URL');

      // Create checkout directly with amount
      const checkout = await this.chargilyService.createCheckout({
        amount: amount,
        currency: 'dzd',
        success_url: `${frontendUrl}/payment/success`,
        failure_url: `${frontendUrl}/payment/failure`,
        payment_method: 'edahabia',
        locale:
          (user?.appSettings?.locale?.language as 'ar' | 'en' | 'fr') || 'en',
        description: `${plan.name} - ${billingCycle}`,
        metadata: {
          userId,
          planId: plan.planId,
          billingCycle,
          type: 'subscription',
        },
      } as any);

      return apiResponse(true, undefined, {
        checkout_url: checkout.checkout_url,
        checkout_id: checkout.id,
      });
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_CHECKOUT_FAILED,
        undefined,
        error.message || 'Failed to create subscription checkout',
      );
    }
  }

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

    console.log({ targetPrice });
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
    const currentPlan = await this.appPlanService.getPlanByPlanId(
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

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('signature') signature: string,
    @Body() event: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Signature header is missing');
    }

    const payload = req.rawBody;

    if (!payload) {
      throw new BadRequestException('Raw body is missing');
    }

    const apiKey = this.configService.get<string>('CHARGILY_SECRET_KEY') || '';

    try {
      const isValid = verifySignature(payload, signature, apiKey);

      if (!isValid) {
        throw new ForbiddenException('Invalid signature');
      }
    } catch (error) {
      throw new ForbiddenException('Signature verification failed');
    }

    // Handle different event types
    console.log('Webhook event received:', event);

    switch (event.type) {
      case 'checkout.paid':
        await this.handleCheckoutPaid(event.data);
        break;
      case 'checkout.failed':
        await this.handleCheckoutFailed(event.data);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return { received: true };
  }

  @Get('checkout/:id')
  async getCheckout(@Param('id') id: string) {
    try {
      const checkout = await this.chargilyService.getCheckout(id);

      return apiResponse(true, undefined, checkout);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.CHECKOUT_NOT_FOUND,
        undefined,
        error.message || 'Failed to retrieve checkout',
      );
    }
  }

  private async handleCheckoutPaid(data: any) {
    console.log('Payment successful:', data);

    try {
      // If this is a subscription payment, activate/update subscription
      if (data.metadata?.type === 'subscription') {
        const { userId, planId, billingCycle } = data.metadata;

        if (!userId || !planId) {
          console.error('Missing userId or planId in webhook metadata');
          return;
        }

        // Create or update subscription using the subscription service
        await this.appSubscriptionService.subscribe(
          userId,
          planId,
          billingCycle || 'monthly',
        );

        console.log(
          `Subscription activated for user ${userId} with plan ${planId}`,
        );
      }

      // TODO: Send confirmation email, update order status, etc.
    } catch (error) {
      console.error('Error handling successful payment:', error);
      // Don't throw error - webhook should return 200 even if our logic fails
      // Log error for monitoring/debugging
    }
  }

  private async handleCheckoutFailed(data: any) {
    console.log('Payment failed:', data);

    try {
      // Log failure for analytics
      // TODO: Notify user about failed payment, log in database, etc.
      if (data.metadata?.userId) {
        console.log(`Payment failed for user ${data.metadata.userId}`);
      }
    } catch (error) {
      console.error('Error handling failed payment:', error);
    }
  }
}
