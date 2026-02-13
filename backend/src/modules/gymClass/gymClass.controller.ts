import {
  ApiResponse,
  CreateClassBookingDto,
  CreateGymClassDto,
  GymClass,
  UpdateGymClassDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymClassService } from './gymClass.service';

@Controller('gym-class')
@UseGuards(JwtAuthGuard)
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Get('gym/:gymId')
  async findAllByGym(
    @Param('gymId') gymId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ApiResponse<GymClass[]>> {
    return this.gymClassService.findAllByGym(
      gymId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('coach/me')
  async findAllByCoach(
    @GetUser('sub') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ApiResponse<GymClass[]>> {
    return this.gymClassService.findAllByCoach(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('member/me')
  async findAllByMember(
    @GetUser('sub') userId: string,
  ): Promise<ApiResponse<GymClass[]>> {
    return this.gymClassService.findAllByMember(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.findOne(id);
  }

  @Post('gym/:gymId')
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateGymClassDto,
    @GetUser('sub') userId: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.create(gymId, dto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGymClassDto,
    @GetUser('sub') userId: string,
    @Query('updateSeries') updateSeries?: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.update(
      id,
      dto,
      userId,
      updateSeries === 'true',
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('deleteSeries') deleteSeries?: string,
    @Query('hardDelete') hardDelete?: string,
  ): Promise<ApiResponse<void>> {
    return this.gymClassService.remove(
      id,
      deleteSeries === 'true',
      hardDelete === 'true',
    );
  }

  @Patch(':id/restore')
  async restore(
    @Param('id') id: string,
    @Query('restoreSeries') restoreSeries?: string,
  ): Promise<ApiResponse<void>> {
    return this.gymClassService.restore(id, restoreSeries === 'true');
  }

  @Post('book')
  async book(
    @GetUser('sub') userId: string,
    @Body() dto: CreateClassBookingDto,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.book(userId, dto);
  }

  @Post('cancel-booking')
  async cancelBooking(
    @GetUser('sub') userId: string,
    @Body('classId') classId: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.cancelBooking(userId, classId);
  }
}
