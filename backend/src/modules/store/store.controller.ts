import {
  ApiResponse,
  CreateProductDto,
  Product,
  UpdateProductDto,
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
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  GymPermissionsGuard,
  RequireGymPermission,
} from '../users/guards/gym-permissions.guard';
import { StoreService } from './store.service';

@Controller('gyms/:gymId/store')
@UseGuards(JwtAuthGuard, GymPermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @RequireGymPermission('store:manage')
  async create(
    @Param('gymId') gymId: string,
    @Body() createProductDto: CreateProductDto,
    @GetUser('_id') userId: string,
  ): Promise<ApiResponse<Product>> {
    const data = await this.storeService.create(
      gymId,
      createProductDto,
      userId,
    );
    return { success: true, data };
  }

  /**
   * Member-friendly endpoint - only requires gym membership, not store:view permission
   * Returns only active products
   */
  @Get('member/products')
  async findAllForMembers(
    @Param('gymId') gymId: string,
    @Query() query: any,
  ): Promise<
    ApiResponse<{ data: Product[]; total: number; totalPages: number }>
  > {
    const data = await this.storeService.findAllForMembers(gymId, query);
    return { success: true, data };
  }

  @Get()
  @RequireGymPermission('store:view')
  async findAll(
    @Param('gymId') gymId: string,
    @Query() query: any,
  ): Promise<
    ApiResponse<{ data: Product[]; total: number; totalPages: number }>
  > {
    const data = await this.storeService.findAll(gymId, query);
    return { success: true, data };
  }

  @Get(':id')
  @RequireGymPermission('store:view')
  async findOne(
    @Param('gymId') gymId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<Product>> {
    const data = await this.storeService.findOne(gymId, id);
    return { success: true, data };
  }

  @Patch(':id')
  @RequireGymPermission('store:manage')
  async update(
    @Param('gymId') gymId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser('_id') userId: string,
  ): Promise<ApiResponse<Product>> {
    const data = await this.storeService.update(
      gymId,
      id,
      updateProductDto,
      userId,
    );
    return { success: true, data };
  }

  @Delete(':id')
  @RequireGymPermission('store:manage')
  async remove(
    @Param('gymId') gymId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<void>> {
    await this.storeService.remove(gymId, id);
    return { success: true };
  }
}
