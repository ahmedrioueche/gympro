import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    const userId = req.user.sub;
    const stats = await this.progressService.getStats(userId);
    return {
      success: true,
      data: stats,
    };
  }

  @Get('history')
  async getHistory(@Request() req: any) {
    const userId = req.user.sub;
    const history = await this.progressService.getHistory(userId);
    return {
      success: true,
      data: history,
    };
  }
}
