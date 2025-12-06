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
import { GymService } from './gym.service';

@Controller('gyms')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  async create(@Body() createGymDto: any) {
    try {
      const gym = await this.gymService.create(createGymDto);
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
}
