import {
  apiResponse,
  CreatePaddleCheckoutDto,
  CreateSubscriptionCheckoutDto,
  ErrorCode,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AppPlansService } from '../appBilling/plan/plan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaddleService } from './paddle.service';

@Controller('paddle')
export class PaddleController {
  constructor(
    private readonly paddleService: PaddleService,
    private readonly appPlanService: AppPlansService,
  ) {
    console.log('[PaddleController] Initialized and ready to receive webhooks');
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Body() dto: CreatePaddleCheckoutDto, @Req() req: any) {
    try {
      const userId = req.user?.sub;
      const result = await this.paddleService.createCheckout(dto, userId);

      return apiResponse(true, undefined, {
        checkout_url: result.checkout_url,
        transaction_id: result.transaction_id,
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

  @Post('checkout/subscription')
  @UseGuards(JwtAuthGuard)
  async createSubscriptionCheckout(
    @Body() dto: CreateSubscriptionCheckoutDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle = 'monthly' } = dto;

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

      // Create Paddle checkout
      const result = await this.paddleService.createSubscriptionCheckout(
        planId,
        billingCycle,
        userId,
      );

      return apiResponse(true, undefined, {
        checkout_url: result.checkout_url,
        transaction_id: result.transaction_id,
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

  // ✅ NEW: Preview upgrade endpoint
  @Post('upgrade/preview')
  @UseGuards(JwtAuthGuard)
  async previewUpgrade(
    @Body() dto: CreateSubscriptionCheckoutDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle = 'monthly' } = dto;

      // 1. Find user's current Paddle subscription
      const activeSub =
        await this.paddleService.appSubscriptionService.getMySubscription(
          userId,
        );

      if (
        !activeSub ||
        activeSub.provider !== 'paddle' ||
        !activeSub.paddleSubscriptionId
      ) {
        throw new BadRequestException(
          'No active Paddle subscription found to upgrade',
        );
      }

      // 2. Fetch target plan
      const targetPlan = await this.appPlanService.getPlanByPlanId(planId);
      if (!targetPlan) {
        throw new BadRequestException('Target plan not found');
      }

      // 3. Resolve price ID
      const priceId = this.paddleService.getPaddlePriceId(
        targetPlan,
        billingCycle,
      );
      if (!priceId) {
        throw new BadRequestException(
          'Price ID not found for target plan/billing cycle',
        );
      }

      // 4. Get preview from Paddle
      const preview = await this.paddleService.previewUpgrade(
        activeSub.paddleSubscriptionId,
        priceId,
      );

      return apiResponse(true, undefined, {
        preview,
        target_plan: targetPlan,
        billing_cycle: billingCycle,
      });
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_UPDATE_ERROR,
        undefined,
        error.message || 'Failed to preview upgrade',
      );
    }
  }

  // ✅ FIXED: Apply upgrade endpoint (renamed from prepareUpgrade)
  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  async applyUpgrade(
    @Body() dto: CreateSubscriptionCheckoutDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle = 'monthly' } = dto;

      // 1. Find user's current Paddle subscription
      const activeSub =
        await this.paddleService.appSubscriptionService.getMySubscription(
          userId,
        );

      if (
        !activeSub ||
        activeSub.provider !== 'paddle' ||
        !activeSub.paddleSubscriptionId
      ) {
        throw new BadRequestException(
          'No active Paddle subscription found to upgrade',
        );
      }

      // 2. Fetch target plan
      const targetPlan = await this.appPlanService.getPlanByPlanId(planId);
      if (!targetPlan) {
        throw new BadRequestException('Target plan not found');
      }

      // 3. Resolve price ID
      const priceId = this.paddleService.getPaddlePriceId(
        targetPlan,
        billingCycle,
      );
      if (!priceId) {
        throw new BadRequestException(
          'Price ID not found for target plan/billing cycle',
        );
      }

      // 4. Apply the upgrade via Paddle
      const result = await this.paddleService.createUpgradeTransaction(
        activeSub.paddleSubscriptionId,
        priceId,
      );

      // 5. Handle different response scenarios
      if (result.success && result.message === 'Upgrade applied immediately') {
        // No payment needed - upgrade was applied immediately
        return apiResponse(true, undefined, {
          upgrade_applied: true,
          message: 'Upgrade applied successfully',
        });
      }

      // Payment needed - return checkout URL
      if (result.checkout_url) {
        return apiResponse(true, undefined, {
          upgrade_applied: false,
          checkout_url: result.checkout_url,
          transaction_id: result.transaction_id,
        });
      }

      // Fallback
      throw new BadRequestException('Unexpected response from Paddle');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_UPDATE_ERROR,
        undefined,
        error.message || 'Failed to apply upgrade',
      );
    }
  }

  @Get('transaction/:transactionId')
  @UseGuards(JwtAuthGuard)
  async getTransactionStatus(@Param('transactionId') transactionId: string) {
    try {
      const result =
        await this.paddleService.getTransactionStatus(transactionId);

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.CHECKOUT_NOT_FOUND,
        undefined,
        error.message || 'Failed to get transaction status',
      );
    }
  }

  @Post('checkout/webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('paddle-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Body() event: any,
  ) {
    try {
      console.log('--- PADDLE WEBHOOK ENDPOINT HIT ---');
      console.log('Headers:', JSON.stringify(req.headers));
      console.log('Body type:', typeof event);

      if (!signature) {
        console.error('Paddle-Signature header is missing');
        throw new BadRequestException('Paddle-Signature header is missing');
      }

      const rawBody = req.rawBody;
      if (!rawBody) {
        console.error('Raw body is missing! Check main.ts for rawBody: true');
        throw new BadRequestException('Raw body is missing');
      }

      console.log(`Raw body length: ${rawBody.length} bytes`);
      console.log(
        `Raw body preview: ${rawBody.toString().substring(0, 50)}...`,
      );

      // Verify webhook signature
      const isValid = this.paddleService.verifyWebhookSignature(
        signature,
        rawBody.toString(),
      );

      if (!isValid) {
        console.error('Invalid signature for webhook event');
        throw new ForbiddenException('Invalid signature');
      }

      // Handle the webhook event
      await this.paddleService.handleWebhook(event);
      return { received: true };
    } catch (error) {
      console.error('CRITICAL WEBHOOK ERROR:', error.message);
      return { received: true, error: error.message };
    }
  }
}
