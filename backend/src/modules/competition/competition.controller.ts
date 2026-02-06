import {
  apiResponse,
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
    try {
      const data = await this.competitionService.findAll(gymId, {
        ...query,
        page: query.page ? Number(query.page) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
      });
      return apiResponse(true, undefined, data);
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  /**
   * Member-friendly endpoint - only requires gym membership
   * MUST be before :id route to avoid conflict
   */
  @Get('member/list')
  async findAllForMembers(
    @Param('gymId') gymId: string,
    @Query() query: CompetitionQueryDto,
  ) {
    try {
      const data = await this.competitionService.findAllForMembers(gymId, {
        ...query,
        page: query.page ? Number(query.page) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
      });
      return apiResponse(true, undefined, data);
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  @Get(':id/participants')
  async getParticipants(@Param('id') id: string) {
    try {
      const data = await this.competitionService.getParticipants(id);
      return apiResponse(true, undefined, data);
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  @Get(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.view)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.competitionService.findOne(id);
      return apiResponse(true, undefined, data);
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  @Post()
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateCompetitionDto,
    @GetUser('sub') userId: string,
  ) {
    try {
      const data = await this.competitionService.create(gymId, dto, userId);
      return apiResponse(
        true,
        undefined,
        data,
        'Competition created successfully',
      );
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  @Put(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompetitionDto,
    @GetUser('sub') userId: string,
  ) {
    try {
      const data = await this.competitionService.update(id, dto, userId);
      return apiResponse(
        true,
        undefined,
        data,
        'Competition updated successfully',
      );
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  @Delete(':id')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async remove(@Param('id') id: string) {
    try {
      const data = await this.competitionService.remove(id);
      return apiResponse(
        true,
        undefined,
        data,
        'Competition removed successfully',
      );
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  /**
   * Member joins a competition
   */
  @Post(':id/join')
  async join(@Param('id') id: string, @GetUser('sub') userId: string) {
    try {
      const data = await this.competitionService.join(id, userId);
      return apiResponse(
        true,
        undefined,
        data,
        'Joined competition successfully',
      );
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  /**
   * Member leaves a competition
   */
  @Post(':id/leave')
  async leave(@Param('id') id: string, @GetUser('sub') userId: string) {
    try {
      const data = await this.competitionService.leave(id, userId);
      return apiResponse(
        true,
        undefined,
        data,
        'Left competition successfully',
      );
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }

  /**
   * Manager sets winners for a completed competition
   */
  @Put(':id/winners')
  @RequireGymPermission(GYM_PERMISSIONS.competitions.manage)
  async setWinners(
    @Param('id') id: string,
    @Body()
    body: {
      winners: {
        place: 1 | 2 | 3;
        userId: string;
        userName?: string;
        userAvatar?: string;
      }[];
    },
    @GetUser('sub') userId: string,
  ) {
    try {
      const data = await this.competitionService.setWinners(
        id,
        body.winners,
        userId,
      );
      return apiResponse(true, undefined, data, 'Winners set successfully');
    } catch (error) {
      return apiResponse(false, undefined, undefined, error.message);
    }
  }
}
