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
  UseGuards,
} from '@nestjs/common';
import { AppPermission } from '../../admin/decorators/app-permission.decorator';
import { AdminDashboardGuard } from '../../admin/guards/admin-dashboard.guard';
import { AppPermissionGuard } from '../../admin/guards/app-permission.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AppPlansService } from './plan.service';

@Controller('app-plans')
export class AppPlansController {
  constructor(private readonly appPlansService: AppPlansService) {}

  /**
   * Create a new plan
   * POST /app-plans
   */
  @Post()
  @UseGuards(JwtAuthGuard, AdminDashboardGuard, AppPermissionGuard)
  @AppPermission('manage_plans')
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
    @Query('level') level?: AppPlanLevel,
    @Query('includeInactive') includeInactive?: string,
  ) {
    let result;
    const shouldIncludeInactive = includeInactive === 'true';

    // Filter by level if provided
    if (level) {
      result = await this.appPlansService.getPlansByLevel(
        level,
        shouldIncludeInactive,
      );
      return apiResponse(
        true,
        undefined,
        result,
        'Plans retrieved successfully',
      );
    }

    // Get all plans
    result = await this.appPlansService.getAllPlans(shouldIncludeInactive);
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
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminDashboardGuard, AppPermissionGuard)
  @AppPermission('manage_plans')
  async updatePlan(@Param('id') id: string, @Body() dto: UpdateAppPlanDto) {
    const plan = await this.appPlansService.updatePlan(id, dto);
    return apiResponse(true, undefined, plan, 'Plan updated successfully');
  }

  /**
   * Delete a plan
   * DELETE /app-plans/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminDashboardGuard, AppPermissionGuard)
  @AppPermission('manage_plans')
  @HttpCode(HttpStatus.OK)
  async deletePlan(@Param('id') id: string) {
    const result = await this.appPlansService.deletePlan(id);
    return apiResponse(true, undefined, result, 'Plan deleted successfully');
  }
}
