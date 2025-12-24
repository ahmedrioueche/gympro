import {
  apiResponse,
  AppSubscriptionBillingCycle,
  ErrorCode,
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChargilyService } from './chargily.service';

@Controller('chargily')
export class ChargilyController {
  private readonly frontendUrl: string | undefined;

  constructor(
    private readonly userService: UsersService,
    private readonly chargilyService: ChargilyService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl =
      this.configService.get('NODE_ENV') === 'prod'
        ? this.configService.get('PROD_FRONTEND_URL')
        : this.configService.get('DEV_FRONTEND_URL') || 'localhost:3000';

    console.log(
      '[ChargilyController] Initialized and ready to receive webhooks',
    );
  }

  // ==================== Generic Checkout ====================

  @Post('checkout')
  async createCheckout(@Body() checkoutData: any) {
    try {
      const result = await this.chargilyService.createCheckout({
        items: checkoutData.items,
        success_url:
          this.configService.get<string>('CHARGILY_SUCCESS_URL') ||
          `${this.frontendUrl}/payment/success`,
        failure_url:
          this.configService.get<string>('CHARGILY_FAILURE_URL') ||
          `${this.frontendUrl}/payment/failure`,
        payment_method: checkoutData.payment_method || 'edahabia',
        locale: checkoutData.locale || 'en',
        pass_fees_to_customer: checkoutData.pass_fees_to_customer || false,
        customer_id: checkoutData.customer_id,
        metadata: checkoutData.metadata,
      });

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.CHECKOUT_CREATION_FAILED,
        undefined,
        error.message || 'Failed to create checkout',
      );
    }
  }

  // ==================== Subscription Checkout ====================

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

      const userLocale =
        (user?.appSettings?.locale?.language as 'ar' | 'en' | 'fr') || 'en';

      const result = await this.chargilyService.createSubscriptionCheckout(
        userId,
        planId,
        billingCycle,
        userLocale,
        this.frontendUrl!,
      );

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_CHECKOUT_FAILED,
        undefined,
        error.message || 'Failed to create subscription checkout',
      );
    }
  }

  // ==================== Upgrade Preview ====================

  @UseGuards(JwtAuthGuard)
  @Post('upgrade/preview')
  async previewUpgrade(
    @Req() req: any,
    @Body()
    body: { planId: string; billingCycle?: AppSubscriptionBillingCycle },
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle = 'monthly' } = body;

      const result = await this.chargilyService.previewUpgrade(
        userId,
        planId,
        billingCycle,
      );

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPGRADE_PREVIEW_FAILED,
        undefined,
        error.message || 'Failed to preview upgrade',
      );
    }
  }

  // ==================== Checkout Retrieval ====================

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

  // ==================== Subscription Upgrade Checkout ====================

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  async createSubscriptionUpgradeCheckout(
    @Req() req: any,
    @Body()
    body: { planId: string; billingCycle?: AppSubscriptionBillingCycle },
  ) {
    try {
      const userId = req.user?.sub;
      const user = await this.userService.findById(userId);
      const { planId, billingCycle = 'monthly' } = body;

      const userLocale =
        (user?.appSettings?.locale?.language as 'ar' | 'en' | 'fr') || 'en';

      const result =
        await this.chargilyService.createSubscriptionUpgradeCheckout(
          userId,
          planId,
          billingCycle,
          userLocale,
          this.frontendUrl!,
        );

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPGRADE_FAILED,
        undefined,
        error.message || 'Failed to create subscription upgrade checkout',
      );
    }
  }

  // ==================== Webhook Handler ====================

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('signature') signature: string,
    @Body() event: any,
  ) {
    console.log('--- CHARGILY WEBHOOK ENDPOINT HIT ---');
    console.log('Headers:', JSON.stringify(req.headers));

    if (!signature) {
      console.error('Signature header is missing');
      throw new BadRequestException('Signature header is missing');
    }

    const payload = req.rawBody;

    if (!payload) {
      console.error('Raw body is missing! Check main.ts for rawBody: true');
      throw new BadRequestException('Raw body is missing');
    }

    console.log(`Raw body length: ${payload.length} bytes`);

    const apiKey = this.configService.get<string>('CHARGILY_SECRET_KEY') || '';

    try {
      const isValid = verifySignature(payload, signature, apiKey);

      if (!isValid) {
        console.error('Invalid signature for webhook event');
        throw new ForbiddenException('Invalid signature');
      }

      console.log('✅ Signature verified successfully');
    } catch (error) {
      console.error('Signature verification failed:', error.message);
      throw new ForbiddenException('Signature verification failed');
    }

    // Handle different event types
    console.log('Webhook event received:', event.type);

    try {
      switch (event.type) {
        case 'checkout.paid':
          await this.chargilyService.handleCheckoutPaid(event.data);
          break;
        case 'checkout.failed':
          await this.chargilyService.handleCheckoutFailed(event.data);
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }

      return { received: true };
    } catch (error) {
      console.error('CRITICAL WEBHOOK ERROR:', error.message);
      // Return 200 to prevent Chargily from retrying
      return { received: true, error: error.message };
    }
  }
}
