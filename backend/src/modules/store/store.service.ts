import {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from './product.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  async create(
    gymId: string,
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = new this.productModel({
      ...createProductDto,
      gymId,
      createdBy: userId,
      updatedBy: userId,
    });
    return (await product.save()).toObject() as unknown as Product;
  }

  async findAll(
    gymId: string,
    query: {
      search?: string;
      category?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Product[]; total: number; totalPages: number }> {
    const { search, category, status, page = 1, limit = 10 } = query;
    const filter: any = { gymId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    const total = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const data = await this.productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { data: data as unknown as Product[], total, totalPages };
  }

  async findOne(gymId: string, id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id, gymId }).lean();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product as unknown as Product;
  }

  async update(
    gymId: string,
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel
      .findOneAndUpdate(
        { _id: id, gymId },
        { ...updateProductDto, updatedBy: userId },
        { new: true },
      )
      .lean();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product as unknown as Product;
  }

  async remove(gymId: string, id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id, gymId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
