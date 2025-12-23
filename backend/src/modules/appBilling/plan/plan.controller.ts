import {
  apiResponse,
  type AppPlanLevel,
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
  async getAllPlans(@Query('level') level?: AppPlanLevel) {
    let result;

    // Filter by level if provided
    if (level) {
      result = await this.appPlansService.getPlansByLevel(level);
      return apiResponse(
        true,
        undefined,
        result,
        'Plans retrieved successfully',
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
