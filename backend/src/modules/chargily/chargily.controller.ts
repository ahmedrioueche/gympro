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
  Logger,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { parseUrls } from '../../common/utils/platform.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChargilyService } from './chargily.service';

@Controller('chargily')
export class ChargilyController {
  private readonly logger = new Logger(ChargilyController.name);
  private readonly frontendUrl: string | undefined;

  constructor(
    private readonly userService: UsersService,
    private readonly chargilyService: ChargilyService,
    private readonly configService: ConfigService,
  ) {
    const prodUrls = parseUrls(
      this.configService.get('PROD_FRONTEND_URL'),
      'https://gympro-power.vercel.app',
    );
    const devUrls = parseUrls(
      this.configService.get('DEV_FRONTEND_URL'),
      'http://localhost:3000',
    );
    this.frontendUrl =
      this.configService.get('NODE_ENV') === 'prod' ? prodUrls[0] : devUrls[0];

    this.logger.log(
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

  @UseGuards(JwtAuthGuard)
  @Post('checkout/renew')
  async createRenewalCheckout(
    @Req() req: any,
    @Body()
    body: { billingCycle?: AppSubscriptionBillingCycle },
  ) {
    try {
      const userId = req.user?.sub;
      const user = await this.userService.findById(userId);
      const { billingCycle } = body;

      const userLocale =
        (user?.appSettings?.locale?.language as 'ar' | 'en' | 'fr') || 'en';

      const result = await this.chargilyService.createRenewalCheckout(
        userId,
        billingCycle,
        userLocale,
        this.frontendUrl,
      );

      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_CHECKOUT_FAILED,
        undefined,
        error.message || 'Failed to create renewal checkout',
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
    this.logger.log('--- CHARGILY WEBHOOK ENDPOINT HIT ---');
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);

    if (!signature) {
      this.logger.error('Signature header is missing');
      throw new BadRequestException('Signature header is missing');
    }

    const payload = req.rawBody;

    if (!payload) {
      this.logger.error('Raw body is missing! Check main.ts for rawBody: true');
      throw new BadRequestException('Raw body is missing');
    }

    this.logger.log(`Raw body length: ${payload.length} bytes`);

    const apiKey = this.configService.get<string>('CHARGILY_SECRET_KEY') || '';

    try {
      const isValid = verifySignature(payload, signature, apiKey);

      if (!isValid) {
        this.logger.error('Invalid signature for webhook event');
        throw new ForbiddenException('Invalid signature');
      }

      this.logger.log('✅ Signature verified successfully');
    } catch (error) {
      this.logger.error(`Signature verification failed: ${error.message}`);
      throw new ForbiddenException('Signature verification failed');
    }

    // Handle different event types
    this.logger.log(`Webhook event received: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.paid':
          await this.chargilyService.handleCheckoutPaid(event.data);
          break;
        case 'checkout.failed':
          await this.chargilyService.handleCheckoutFailed(event.data);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`CRITICAL WEBHOOK ERROR: ${error.message}`);
      // Return 200 to prevent Chargily from retrying
      return { received: true, error: error.message };
    }
  }
}
