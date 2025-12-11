import {
  apiResponse,
  type AppPlanLevel,
  type AppPlanType,
  type CreateAppPlanDto,
  type UpdateAppPlanDto,
} from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppPlansService } from './plan.service';

@Controller('app-plans')
export class AppPlansController {
  constructor(private readonly appPlansService: AppPlansService) {}

  /**
   * Create a new plan
   * POST /app-plans
   * @admin-only - Add your admin guard here
   */
  @Post()
  // @UseGuards(AdminGuard) // Uncomment and add your admin guard
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() dto: CreateAppPlanDto) {
    const plan = await this.appPlansService.createPlan(dto);
    return apiResponse(true, undefined, plan, 'Plan created successfully');
  }

  /**
   * Get all plans
   * GET /app-plans
   * @public
   */
  @Get()
  async getAllPlans(
    @Query('type') type?: AppPlanType,
    @Query('level') level?: AppPlanLevel,
  ) {
    let result;

    // Filter by type if provided
    if (type && !level) {
      result = await this.appPlansService.getPlansByType(type);
      return apiResponse(
        true,
        undefined,
        result,
        'Plans retrieved successfully',
      );
    }

    // Filter by level if provided
    if (level && !type) {
      result = await this.appPlansService.getPlansByLevel(level);
      return apiResponse(
        true,
        undefined,
        result,
        'Plans retrieved successfully',
      );
    }

    // Get specific plan if both provided
    if (type && level) {
      result = await this.appPlansService.getPlanByLevelAndType(level, type);
      return apiResponse(
        true,
        undefined,
        result,
        'Plan retrieved successfully',
      );
    }

    // Get all plans
    result = await this.appPlansService.getAllPlans();
    return apiResponse(
      true,
      undefined,
      result,
      'All plans retrieved successfully',
    );
  }

  /**
   * Get subscription plans only
   * GET /app-plans/subscription
   * @public
   */
  @Get('subscription')
  async getSubscriptionPlans() {
    const plans = await this.appPlansService.getSubscriptionPlans();
    return apiResponse(
      true,
      undefined,
      plans,
      'Subscription plans retrieved successfully',
    );
  }

  /**
   * Get one-time purchase plans only
   * GET /app-plans/one-time
   * @public
   */
  @Get('one-time')
  async getOneTimePlans() {
    const plans = await this.appPlansService.getOneTimePlans();
    return apiResponse(
      true,
      undefined,
      plans,
      'One-time plans retrieved successfully',
    );
  }

  /**
   * Compare two plans
   * GET /app-plans/compare?level1=starter&level2=premium&type=subscription
   * @public
   */
  @Get('compare')
  async comparePlans(
    @Query('level1') level1: AppPlanLevel,
    @Query('level2') level2: AppPlanLevel,
    @Query('type') type: AppPlanType,
  ) {
    const comparison = await this.appPlansService.comparePlans(
      level1,
      level2,
      type,
    );
    return apiResponse(
      true,
      undefined,
      comparison,
      'Plans compared successfully',
    );
  }

  /**
   * Get plan by ID
   * GET /app-plans/:id
   * @public
   */
  @Get(':id')
  async getPlanById(@Param('id') id: string) {
    const plan = await this.appPlansService.getPlanById(id);
    return apiResponse(true, undefined, plan, 'Plan retrieved successfully');
  }

  /**
   * Update a plan
   * PUT /app-plans/:id
   * @admin-only
   */
  @Put(':id')
  // @UseGuards(AdminGuard) // Uncomment and add your admin guard
  async updatePlan(@Param('id') id: string, @Body() dto: UpdateAppPlanDto) {
    const plan = await this.appPlansService.updatePlan(id, dto);
    return apiResponse(true, undefined, plan, 'Plan updated successfully');
  }

  /**
   * Delete a plan
   * DELETE /app-plans/:id
   * @admin-only
   */
  @Delete(':id')
  // @UseGuards(AdminGuard) // Uncomment and add your admin guard
  @HttpCode(HttpStatus.OK)
  async deletePlan(@Param('id') id: string) {
    const result = await this.appPlansService.deletePlan(id);
    return apiResponse(true, undefined, result, 'Plan deleted successfully');
  }
}
