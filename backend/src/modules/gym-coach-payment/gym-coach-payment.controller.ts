import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymCoachPaymentService } from './gym-coach-payment.service';

@Controller('gym-coach-payments')
@UseGuards(JwtAuthGuard)
export class GymCoachPaymentController {
  constructor(private readonly paymentService: GymCoachPaymentService) {}

  @Get('my-payments')
  async getMyPayments(
    @Req() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('gymId') gymId?: string,
    @Query('status') status?: any,
  ) {
    const userId = req.user.sub;
    // TODO: Verify user is affiliated with gym
    return this.paymentService.findAll(userId, gymId, {
      page,
      limit,
      status,
    });
  }

  @Get('my-stats')
  async getMyStats(@Req() req: any, @Query('gymId') gymId?: string) {
    const userId = req.user.sub;
    return this.paymentService.getBalance(userId, gymId);
  }
}
