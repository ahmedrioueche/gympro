import {
  CreateExerciseDto,
  ExerciseFilters,
  apiResponse,
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  async createExercise(@Body() dto: CreateExerciseDto, @Req() req: any) {
    const exercise = await this.exercisesService.createExercise(
      dto,
      req.user.sub,
    );
    return apiResponse(
      true,
      undefined,
      exercise,
      'Exercise created successfully',
    );
  }

  @Get()
  async getExercises(@Query() filters: ExerciseFilters, @Req() req: any) {
    // Add user ID to filters for permission filtering
    const filtersWithUser = {
      ...filters,
      createdBy: req.user.sub,
    };
    const exercises =
      await this.exercisesService.findAllExercises(filtersWithUser);
    return apiResponse(
      true,
      undefined,
      exercises,
      'Exercises retrieved successfully',
    );
  }

  @Get(':id')
  async getExercise(@Param('id') id: string) {
    const exercise = await this.exercisesService.findExerciseById(id);
    return apiResponse(
      true,
      undefined,
      exercise,
      'Exercise retrieved successfully',
    );
  }

  @Patch(':id')
  async updateExercise(
    @Param('id') id: string,
    @Body() dto: Partial<CreateExerciseDto>,
    @Req() req: any,
  ) {
    const exercise = await this.exercisesService.updateExercise(
      id,
      dto,
      req.user.sub,
    );
    return apiResponse(
      true,
      undefined,
      exercise,
      'Exercise updated successfully',
    );
  }

  @Delete(':id')
  async deleteExercise(@Param('id') id: string, @Req() req: any) {
    await this.exercisesService.deleteExercise(id, req.user.sub);
    return apiResponse(true, undefined, null, 'Exercise deleted successfully');
  }
}
