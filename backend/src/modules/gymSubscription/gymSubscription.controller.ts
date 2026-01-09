import {
  ApiResponse,
  CreateSubscriptionTypeDto,
  SubscriptionType,
  UpdateSubscriptionTypeDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GymSubscriptionService } from './gymSubscription.service';

@Controller('gyms/:gymId/subscription-types')
export class GymSubscriptionController {
  constructor(private readonly service: GymSubscriptionService) {}

  @Get()
  async getSubscriptionTypes(
    @Param('gymId') gymId: string,
  ): Promise<ApiResponse<SubscriptionType[]>> {
    return this.service.getSubscriptionTypes(gymId);
  }

  @Post()
  async createSubscriptionType(
    @Param('gymId') gymId: string,
    @Body() dto: CreateSubscriptionTypeDto,
  ): Promise<ApiResponse<SubscriptionType>> {
    return this.service.createSubscriptionType(gymId, dto);
  }

  @Put(':id')
  async updateSubscriptionType(
    @Param('gymId') gymId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionTypeDto,
  ): Promise<ApiResponse<SubscriptionType>> {
    return this.service.updateSubscriptionType(gymId, id, dto);
  }

  @Delete(':id')
  async deleteSubscriptionType(
    @Param('gymId') gymId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<void>> {
    return this.service.deleteSubscriptionType(gymId, id);
  }
}
