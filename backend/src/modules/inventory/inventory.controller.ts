import {
  CreateEquipmentDto,
  GYM_PERMISSIONS,
  UpdateEquipmentDto,
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
import { InventoryService } from './inventory.service';

@Controller('gyms/:gymId/inventory')
@UseGuards(JwtAuthGuard, GymPermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Member-friendly endpoint - only requires gym membership, not inventory:view permission
   * Returns all equipment items visible to members
   */
  @Get('member/equipment')
  async findAllForMembers(
    @Param('gymId') gymId: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.inventoryService.findAll(gymId, {
      search,
      category,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...data };
  }

  @Get()
  @RequireGymPermission(GYM_PERMISSIONS.inventory.view)
  async findAll(
    @Param('gymId') gymId: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.inventoryService.findAll(gymId, {
      search,
      category,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...data };
  }

  @Get(':id')
  @RequireGymPermission(GYM_PERMISSIONS.inventory.view)
  async findOne(@Param('id') id: string) {
    const data = await this.inventoryService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @RequireGymPermission(GYM_PERMISSIONS.inventory.manage)
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateEquipmentDto,
    @GetUser('sub') userId: string,
  ) {
    const data = await this.inventoryService.create(gymId, dto, userId);
    return { success: true, data, message: 'Equipment added successfully' };
  }

  @Put(':id')
  @RequireGymPermission(GYM_PERMISSIONS.inventory.manage)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentDto,
    @GetUser('sub') userId: string,
  ) {
    const data = await this.inventoryService.update(id, dto, userId);
    return { success: true, data, message: 'Equipment updated successfully' };
  }

  @Delete(':id')
  @RequireGymPermission(GYM_PERMISSIONS.inventory.manage)
  async remove(@Param('id') id: string) {
    const data = await this.inventoryService.remove(id);
    return { ...data, message: 'Equipment removed successfully' };
  }
}
