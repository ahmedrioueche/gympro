import {
  apiResponse,
  AppSubscriptionBillingCycle,
  ErrorCode,
  GetSubscriptionDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GeminiService } from 'src/common/services/gemini.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SubscriptionBlockerService } from './subscription-blocker.service';
import { AppSubscriptionService } from './subscription.service';

@Controller('app-subscriptions')
export class AppSubscriptionController {
  constructor(
    private readonly appSubscriptionService: AppSubscriptionService,
    private readonly geminiService: GeminiService,
    private readonly blockerService: SubscriptionBlockerService,
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
  @Post('downgrade')
  async downgradeSubscription(
    @Req() req: any,
    @Body() body: { planId: string; billingCycle?: string },
  ) {
    try {
      const userId = req.user?.sub;
      const { planId, billingCycle } = body;

      const subscription =
        await this.appSubscriptionService.downgradeSubscription(
          userId,
          planId,
          billingCycle as AppSubscriptionBillingCycle,
        );

      return apiResponse(
        true,
        undefined,
        subscription,
        'Downgrade scheduled successfully',
      );
    } catch (error: any) {
      let errorCode = ErrorCode.SUBSCRIPTION_UPDATE_ERROR;
      if (error.status === 404) {
        errorCode = ErrorCode.NO_ACTIVE_SUBSCRIPTION;
      } else if (error.status === 400) {
        errorCode = ErrorCode.SUBSCRIPTION_UPDATE_ERROR;
      }

      const message = error.message || 'Failed to schedule downgrade';
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
      if (error.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new HttpException(
          apiResponse(
            false,
            ErrorCode.SUBSCRIPTION_CANCEL_LIMIT_EXCEEDED,
            null,
            error.message,
          ),
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      let errorCode = ErrorCode.SUBSCRIPTION_CANCEL_ERROR;
      if (error.status === 404) {
        errorCode = ErrorCode.NO_ACTIVE_SUBSCRIPTION;
      }

      const message = error.message || 'Failed to cancel subscription';
      return apiResponse(false, errorCode, null, message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-cancel-reason')
  async validateCancellationReason(
    @Req() req: any,
    @Body() body: { reason?: string },
  ) {
    try {
      const { reason } = body;
      console.log({ reason });
      const prompt = `Is the following reason for canceling a subscription valid? "${reason}".
       Return only "true" if it is a coherent sentence that explains a probable reason for canceling a subscription 
       or "false" if it is not, or if it is an insult, return no introduction no conclusion, just "true" or "false"`;
      const response = await this.geminiService.generateText(prompt);
      console.log({ response });
      return apiResponse(true, undefined, response);
    } catch (error: any) {
      return apiResponse(
        true,
        undefined,
        'true',
        'Could not validate reason, move forward anyways',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('reactivate')
  async reactivateSubscription(@Req() req: any) {
    try {
      const userId = req.user?.sub;

      const subscription =
        await this.appSubscriptionService.reactivateSubscription(userId);

      return apiResponse(
        true,
        undefined,
        subscription,
        'Subscription reactivated successfully',
      );
    } catch (error: any) {
      const errorCode =
        error.status === 404
          ? ErrorCode.NO_ACTIVE_SUBSCRIPTION
          : ErrorCode.SUBSCRIPTION_UPDATE_ERROR;
      const message = error.message || 'Failed to reactivate subscription';
      return apiResponse(false, errorCode, null, message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel-pending-change')
  async cancelPendingChange(@Req() req: any) {
    try {
      const userId = req.user?.sub;

      const subscription =
        await this.appSubscriptionService.cancelPendingChange(userId);

      return apiResponse(
        true,
        undefined,
        subscription,
        'Pending plan change cancelled successfully',
      );
    } catch (error: any) {
      const errorCode =
        error.status === 404
          ? ErrorCode.NO_ACTIVE_SUBSCRIPTION
          : ErrorCode.SUBSCRIPTION_UPDATE_ERROR;
      const message = error.message || 'Failed to cancel pending change';
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

  @UseGuards(JwtAuthGuard)
  @Get('blocker-config')
  async getBlockerConfig(@Req() req: any) {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        return apiResponse(
          false,
          ErrorCode.UNAUTHORIZED,
          null,
          'User not authenticated',
        );
      }

      const config = await this.blockerService.getBlockerConfig(userId);

      return apiResponse(
        true,
        undefined,
        config,
        config
          ? 'Blocker config retrieved successfully'
          : 'No blocker required',
      );
    } catch (error: any) {
      console.error('Error fetching blocker config:', error);
      return apiResponse(
        false,
        ErrorCode.SUBSCRIPTION_FETCH_ERROR,
        null,
        'Failed to fetch blocker configuration',
      );
    }
  }
}
