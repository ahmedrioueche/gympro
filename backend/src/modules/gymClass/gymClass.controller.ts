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
  ): Promise<ApiResponse<GymClass[]>> {
    return this.gymClassService.findAllByGym(gymId);
  }

  @Get('coach/me')
  async findAllByCoach(
    @GetUser('_id') userId: string,
  ): Promise<ApiResponse<GymClass[]>> {
    return this.gymClassService.findAllByCoach(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.findOne(id);
  }

  @Post('gym/:gymId')
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateGymClassDto,
    @GetUser('_id') userId: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.create(gymId, dto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGymClassDto,
    @GetUser('_id') userId: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.update(id, dto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<void>> {
    return this.gymClassService.remove(id);
  }

  @Post('book')
  async book(
    @GetUser('_id') userId: string,
    @Body() dto: CreateClassBookingDto,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.book(userId, dto);
  }

  @Post('cancel-booking')
  async cancelBooking(
    @GetUser('_id') userId: string,
    @Body('classId') classId: string,
  ): Promise<ApiResponse<GymClass>> {
    return this.gymClassService.cancelBooking(userId, classId);
  }
}
