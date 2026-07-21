import {
  type CreateProgramDto,
  type LogSessionDto,
  type SyncSessionTimerDto,
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
    const filters: any = { search };

    // Abstract filters for contextual dashboard scoping
    if (source === 'member' || source === 'me') {
      filters.createdBy = req.user.sub;
    } else if (source === 'other') {
      filters.excludeCreatedBy = req.user.sub;
    } else if (source) {
      filters.source = source;
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
  async startProgram(
    @Request() req,
    @Param('id') id: string,
    @Query('force') force?: string,
  ) {
    const isForce = force === 'true';
    const history = await this.trainingService.startProgram(
      id,
      req.user.sub,
      isForce,
    );
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

  @Post(['session', 'sessions'])
  logSession(@Req() req, @Body() dto: LogSessionDto) {
    return this.trainingService.logSession(req.user.sub, dto);
  }

  @Post('sessions/timer')
  async syncSessionTimer(@Req() req, @Body() dto: SyncSessionTimerDto) {
    const result = await this.trainingService.syncSessionTimer(
      req.user.sub,
      dto,
    );
    return apiResponse(
      true,
      undefined,
      result,
      'Session timer synced successfully',
    );
  }

  @Delete(':programId/sessions/:sessionId')
  deleteSession(
    @Req() req,
    @Param('programId') programId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.trainingService.deleteSession(
      req.user.sub,
      programId,
      sessionId,
    );
  }

  @Post('program/abandon')
  async abandonProgram(@Request() req) {
    const history = await this.trainingService.abandonProgram(req.user.sub);
    return apiResponse(
      true,
      undefined,
      history,
      'Program archived successfully',
    );
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

  @Post('history/:id/resume')
  async resumeHistory(@Request() req, @Param('id') id: string) {
    const history = await this.trainingService.resumeHistory(id, req.user.sub);
    return apiResponse(
      true,
      undefined,
      history,
      'Program resumed successfully',
    );
  }

  @Post('programs/:id/comment')
  async addComment(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: {
      text: string;
      rating: number;
      userName: string;
      userImage?: string;
    },
  ) {
    const program = await this.trainingService.addComment(
      id,
      req.user.sub,
      body.userName || 'Anonymous', // Fallback if userName not provided
      body.userImage,
      body.text,
      body.rating,
    );
    return apiResponse(true, undefined, program, 'Comment added successfully');
  }
}
