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
import { UsersService } from '../users/users.service';
import { PaddleService } from './paddle.service';

@Controller('paddle')
export class PaddleController {
  constructor(
    private readonly paddleService: PaddleService,
    private readonly userService: UsersService,
    private readonly appPlanService: AppPlansService,
  ) {}

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

      // Get user for metadata
      const user = await this.userService.findById(userId);

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

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('paddle-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Body() event: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Paddle-Signature header is missing');
    }

    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new BadRequestException('Raw body is missing');
    }

    try {
      // Verify webhook signature
      const isValid = this.paddleService.verifyWebhookSignature(
        signature,
        rawBody.toString(),
      );

      if (!isValid) {
        throw new ForbiddenException('Invalid signature');
      }
    } catch (error) {
      throw new ForbiddenException('Signature verification failed');
    }

    // Handle the webhook event
    console.log('Paddle webhook event received:', event);

    try {
      await this.paddleService.handleWebhook(event);
      return { received: true };
    } catch (error) {
      console.error('Error handling Paddle webhook:', error);
      // Return 200 even if internal processing fails
      // Paddle will retry failed webhooks
      return { received: true, error: 'Processing failed but acknowledged' };
    }
  }
}
