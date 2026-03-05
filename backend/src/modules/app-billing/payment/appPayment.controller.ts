import {
  apiResponse,
  AppPaymentFilterDto,
  ErrorCode,
} from '@ahmedrioueche/gympro-client';
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AppPaymentService } from './appPayment.service';

@Controller('app-payments')
export class AppPaymentController {
  constructor(private readonly paymentService: AppPaymentService) {}

  /**
   * Get current user's payments with filtering and pagination
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyPayments(@Req() req: any, @Query() filters: AppPaymentFilterDto) {
    try {
      const userId = req.user?.sub;

      const result = await this.paymentService.getUserPayments(userId, filters);

      return apiResponse(
        true,
        undefined,
        result,
        'Payments retrieved successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.PAYMENT_FETCH_ERROR,
        null,
        'Failed to fetch payments',
      );
    }
  }

  /**
   * Get payment statistics for current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getMyPaymentStats(@Req() req: any) {
    try {
      const userId = req.user?.sub;

      const stats = await this.paymentService.getPaymentStats(userId);

      return apiResponse(
        true,
        undefined,
        stats,
        'Payment stats retrieved successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.PAYMENT_FETCH_ERROR,
        null,
        'Failed to fetch payment stats',
      );
    }
  }

  /**
   * Get a single payment by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPaymentById(@Req() req: any, @Param('id') paymentId: string) {
    try {
      const userId = req.user?.sub;

      const payment = await this.paymentService.getPaymentById(
        paymentId,
        userId,
      );

      if (!payment) {
        return apiResponse(
          false,
          ErrorCode.NOT_FOUND,
          null,
          'Payment not found',
        );
      }

      return apiResponse(
        true,
        undefined,
        payment,
        'Payment retrieved successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.PAYMENT_FETCH_ERROR,
        null,
        'Failed to fetch payment',
      );
    }
  }
}
