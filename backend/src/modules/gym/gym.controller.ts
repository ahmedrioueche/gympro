import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
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
import { DashboardService } from '../dashboard/dashboard.service';
import {
  GymPermissionsGuard,
  RequireGymPermission,
} from '../users/guards/gym-permissions.guard';
import { GymService } from './gym.service';

@Controller('gyms')
export class GymController {
  constructor(
    private readonly gymService: GymService,
    private readonly dashboardService: DashboardService,
  ) {}

  @Post()
  async create(@Body() createGymDto: any) {
    try {
      const gym = await this.gymService.create(createGymDto);

      // Grant manager dashboard access to the owner
      if (createGymDto.owner) {
        await this.dashboardService.grantManagerAccess(createGymDto.owner);
      }

      return apiResponse(true, undefined, gym, 'Gym created successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.CREATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const gyms = await this.gymService.findAll();
      return apiResponse(true, undefined, gyms);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.FETCH_GYMS_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get('my-gyms')
  @UseGuards(JwtAuthGuard)
  async findMyGyms(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const gyms = await this.gymService.findByOwner(userId);
      return apiResponse(true, undefined, gyms);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.FETCH_MY_GYMS_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get('member')
  @UseGuards(JwtAuthGuard)
  async findMemberGyms(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const gyms = await this.gymService.findByMember(userId);
      return apiResponse(true, undefined, gyms);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.FETCH_MEMBER_GYMS_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get('all-my-gyms')
  @UseGuards(JwtAuthGuard)
  async findAllMyGyms(@Req() req: any) {
    try {
      const userId = req.user?.sub;
      const gyms = await this.gymService.findAllForUser(userId);
      return apiResponse(true, undefined, gyms);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.FETCH_ALL_MY_GYMS_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getGymMembers(
    @Param('id') gymId: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const result = await this.gymService.getGymMembers(gymId, {
        search,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 12,
      });
      return apiResponse(true, undefined, result);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.FETCH_GYMS_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const gym = await this.gymService.findOne(id);
      return apiResponse(true, undefined, gym);
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.GYM_NOT_FOUND,
        undefined,
        error.message,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGymDto: any) {
    try {
      const gym = await this.gymService.update(id, updateGymDto);
      return apiResponse(true, undefined, gym, 'Gym updated successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPDATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Patch(':id/settings')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('settings:manage')
  async updateSettings(
    @Param('id') gymId: string,
    @Body() updateSettingsDto: any,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub;
      const gym = await this.gymService.updateSettings(
        gymId,
        updateSettingsDto,
        userId,
      );
      return apiResponse(
        true,
        undefined,
        gym,
        'Gym settings updated successfully',
      );
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPDATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const gym = await this.gymService.remove(id);
      return apiResponse(true, undefined, gym, 'Gym deleted successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.DELETE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Post(':id/media')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('marketing:manage')
  async addMedia(@Param('id') id: string, @Body() mediaItem: any) {
    console.log(`AddMedia request for gym ${id}:`, mediaItem);
    try {
      const gym = await this.gymService.addMedia(id, mediaItem);
      console.log(
        `AddMedia success for gym ${id}. Media count: ${gym.media?.length}`,
      );
      return apiResponse(true, undefined, gym, 'Media added successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPDATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Delete(':id/media/:publicId')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('marketing:manage')
  async removeMedia(
    @Param('id') id: string,
    @Param('publicId') publicId: string,
  ) {
    try {
      const gym = await this.gymService.removeMedia(id, publicId);
      return apiResponse(true, undefined, gym, 'Media removed successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPDATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }

  @Post(':id/banner')
  @UseGuards(JwtAuthGuard, GymPermissionsGuard)
  @RequireGymPermission('marketing:manage')
  async setBanner(@Param('id') id: string, @Body() banner: any) {
    try {
      const gym = await this.gymService.setBanner(id, banner);
      return apiResponse(true, undefined, gym, 'Banner set successfully');
    } catch (error) {
      return apiResponse(
        false,
        ErrorCode.UPDATE_GYM_FAILED,
        undefined,
        error.message,
      );
    }
  }
}
