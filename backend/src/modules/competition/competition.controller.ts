import {
  CompetitionQueryDto,
  CreateCompetitionDto,
  GYM_PERMISSIONS,
  UpdateCompetitionDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  GymPermissionsGuard,
  RequireGymPermission,
} from '../users/guards/gym-permissions.guard';
import { CompetitionService } from './competition.service';

@Controller('gyms/:gymId/competitions')
@UseGuards(JwtAuthGuard, GymPermissionsGuard)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  @RequireGymPermission(GYM_PERMISSIONS.competitions.view)
  async findAll(
    @Param('gymId') gymId: string,
    @Query() query: CompetitionQueryDto,
  ) {
    const data = await this.competitionService.findAll(gymId, {
      ...query,
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
    });
    return { success: true, ...data };
  }

  @Get(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.view)
  async findOne(@Param('id') id: string) {
    const data = await this.competitionService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateCompetitionDto,
    @GetUser('sub') userId: string,
  ) {
    const data = await this.competitionService.create(gymId, dto, userId);
    return { success: true, data, message: 'Competition created successfully' };
  }

  @Put(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompetitionDto,
    @GetUser('sub') userId: string,
  ) {
    const data = await this.competitionService.update(id, dto, userId);
    return { success: true, data, message: 'Competition updated successfully' };
  }

  @Delete(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async remove(@Param('id') id: string) {
    const data = await this.competitionService.remove(id);
    return { ...data, message: 'Competition removed successfully' };
  }
}
