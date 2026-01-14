import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  GymPermissionsGuard,
  RequireGymPermission,
} from '../users/guards/gym-permissions.guard';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Body() body: { token: string; gymId: string }) {
    return this.attendanceService.checkIn(body.token, body.gymId);
  }

  @Get('access-token/:gymId')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('attendance:view')
  async getAccessToken(@Param('gymId') gymId: string, @Request() req: any) {
    const memberId = req.user.sub;
    return this.attendanceService.generateAccessToken(memberId, gymId);
  }

  @Get('logs/:gymId')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('attendance:view')
  async getLogs(@Param('gymId') gymId: string) {
    return this.attendanceService.getAttendanceLogs(gymId);
  }

  @Get('my')
  async getMyAttendance(@Request() req: any) {
    const userId = req.user.sub;
    return this.attendanceService.getMyAttendance(userId);
  }

  @Get('my/:gymId')
  async getMyAttendanceInGym(
    @Param('gymId') gymId: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.attendanceService.getMyAttendanceInGym(userId, gymId);
  }
}
