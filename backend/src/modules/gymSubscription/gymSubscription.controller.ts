import {
  ApiResponse,
  CreateSubscriptionTypeDto,
  GymManagerFeature,
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
  UseGuards,
} from '@nestjs/common';
import {
  GymFeatureGuard,
  RequireFeature,
} from '../../common/guards/gym-feature.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GymSubscriptionService } from './gymSubscription.service';

@Controller('gyms/:gymId/subscription-types')
@UseGuards(JwtAuthGuard, GymFeatureGuard)
@RequireFeature(GymManagerFeature.SUBSCRIPTIONS)
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
