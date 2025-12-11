import {
  apiResponse,
  ErrorCode,
  GetSubscriptionDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AppSubscriptionService } from './subscription.service';

@Controller('app-subscriptions')
export class AppSubscriptionController {
  constructor(
    private readonly appSubscriptionService: AppSubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMySubscription(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const subscription =
        await this.appSubscriptionService.getMySubscription(userId);

      if (!subscription) {
        return apiResponse(
          true,
          undefined,
          null,
          'No active subscription found',
        );
      }

      return apiResponse(
        true,
        undefined,
        subscription as GetSubscriptionDto,
        'Subscription retrieved successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_FETCH_ERROR,
        null,
        'Failed to fetch subscription',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(
    @Req() req: any,
    @Body()
    body: { planId: string; billingCycle?: 'monthly' | 'yearly' | 'oneTime' },
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle = 'monthly' } = body;

      const subscription = await this.appSubscriptionService.subscribe(
        userId,
        planId,
        billingCycle,
      );

      return apiResponse(
        true,
        undefined,
        subscription,
        'Subscription created successfully',
      );
    } catch (error: any) {
      const errorCode =
        error.status === 404
          ? ErrorCode.PLAN_NOT_FOUND
          : ErrorCode.SUBSCRIPTION_CREATE_ERROR;
      const message = error.message || 'Failed to create subscription';
      return apiResponse(false, errorCode, null, message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel')
  async cancelSubscription(@Req() req: any, @Body() body: { reason?: string }) {
    try {
      const userId = req.user?.sub;
      const { reason } = body;

      const subscription = await this.appSubscriptionService.cancelSubscription(
        userId,
        reason,
      );

      return apiResponse(
        true,
        undefined,
        subscription,
        'Subscription cancelled successfully',
      );
    } catch (error: any) {
      const errorCode =
        error.status === 404
          ? ErrorCode.NO_ACTIVE_SUBSCRIPTION
          : ErrorCode.SUBSCRIPTION_CANCEL_ERROR;
      const message = error.message || 'Failed to cancel subscription';
      return apiResponse(false, errorCode, null, message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getSubscriptionHistory(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const history =
        await this.appSubscriptionService.getSubscriptionHistory(userId);

      return apiResponse(
        true,
        undefined,
        history,
        'Subscription history retrieved successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.HISTORY_FETCH_ERROR,
        null,
        'Failed to fetch subscription history',
      );
    }
  }
}
