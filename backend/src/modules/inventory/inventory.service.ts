import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipmentItemModel } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(EquipmentItemModel.name)
    private equipmentModel: Model<EquipmentItemModel>,
  ) {}

  async findAll(
    gymId: string,
    options: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{
    data: EquipmentItemModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, category, page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    const query: any = { gymId };

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    if (category) {
      query.category = category;
    }

    const [data, total] = await Promise.all([
      this.equipmentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.equipmentModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<EquipmentItemModel> {
    const item = await this.equipmentModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return item;
  }

  async create(
    gymId: string,
    dto: CreateEquipmentDto,
    userId: string,
  ): Promise<EquipmentItemModel> {
    const newItem = new this.equipmentModel({
      ...dto,
      gymId,
      createdBy: userId,
    });
    return newItem.save();
  }

  async update(
    id: string,
    dto: UpdateEquipmentDto,
    userId: string,
  ): Promise<EquipmentItemModel> {
    const updatedItem = await this.equipmentModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          updatedBy: userId,
        },
        { new: true },
      )
      .exec();

    if (!updatedItem) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.equipmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return { success: true };
  }
}
