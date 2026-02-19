import {
  CreateAppFeaturePackageDto,
  UpdateAppFeaturePackageDto,
  UserRole,
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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../../users/guards/roles.guard';
import { AppFeaturePackageService } from './feature-package.service';

@Controller('admin/feature-packages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.AppEditor)
export class AppFeaturePackageController {
  constructor(private readonly packageService: AppFeaturePackageService) {}

  @Post()
  async create(@Body() dto: CreateAppFeaturePackageDto) {
    return this.packageService.create(dto);
  }

  @Get()
  async findAll(@Query('activeOnly') activeOnly: string) {
    return this.packageService.findAll(activeOnly === 'true');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAppFeaturePackageDto,
  ) {
    return this.packageService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.packageService.delete(id);
  }
}
