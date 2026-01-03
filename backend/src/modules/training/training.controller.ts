import {
  type CreateProgramDto,
  type LogSessionDto,
  apiResponse,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrainingService } from './training.service';

@Controller('training')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('programs')
  async createProgram(@Request() req, @Body() dto: CreateProgramDto) {
    const program = await this.trainingService.createProgram(dto, req.user.sub);
    return apiResponse(
      true,
      undefined,
      program,
      'Program created successfully',
    );
  }

  @Get('programs')
  async getPrograms(
    @Request() req,
    @Query('source') source?: string,
    @Query('search') search?: string,
  ) {
    // If source is 'member', implicitly filter by current user's CreatedBy
    const filters: any = { source, search };
    if (source === 'member') {
      filters.createdBy = req.user.sub;
    }

    const programs = await this.trainingService.findAllPrograms(filters);
    return apiResponse(
      true,
      undefined,
      programs,
      'Programs retrieved successfully',
    );
  }

  @Get('programs/:id')
  async getProgram(@Param('id') id: string) {
    const program = await this.trainingService.findProgramById(id);
    return apiResponse(
      true,
      undefined,
      program,
      'Program details retrieved successfully',
    );
  }

  @Patch('programs/:id')
  async updateProgram(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: Partial<CreateProgramDto>,
  ) {
    const program = await this.trainingService.updateProgram(
      id,
      dto,
      req.user.sub,
    );
    return apiResponse(
      true,
      undefined,
      program,
      'Program updated successfully',
    );
  }

  @Post('programs/:id/start')
  async startProgram(@Request() req, @Param('id') id: string) {
    const history = await this.trainingService.startProgram(id, req.user.sub);
    return apiResponse(
      true,
      undefined,
      history,
      'Program started successfully',
    );
  }

  @Get('active')
  async getActiveProgram(@Request() req) {
    const history = await this.trainingService.getActiveProgram(req.user.sub);
    return apiResponse(
      true,
      undefined,
      history,
      'Active program retrieved successfully',
    );
  }

  @Post('sessions')
  async logSession(@Request() req, @Body() dto: LogSessionDto) {
    const history = await this.trainingService.logSession(req.user.sub, dto);
    return apiResponse(true, undefined, history, 'Session logged successfully');
  }

  @Get('history')
  async getHistory(@Request() req) {
    const history = await this.trainingService.getHistory(req.user.sub);
    return apiResponse(
      true,
      undefined,
      history,
      'Training history retrieved successfully',
    );
  }
}
