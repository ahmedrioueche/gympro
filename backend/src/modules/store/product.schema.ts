import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  ProductCategory,
  ProductStatus,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'products' })
export class ProductModel extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'GymModel',
    required: true,
  })
  gymId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: PRODUCT_CATEGORIES,
    default: 'other',
  })
  category: ProductCategory;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: 'DZD' })
  currency: string;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;

  @Prop({ trim: true })
  sku?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: String,
    required: true,
    enum: PRODUCT_STATUS,
    default: 'active',
  })
  status: ProductStatus;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);

// Add text search index
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
