import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CONDITIONS,
  EquipmentCategory,
  EquipmentCondition,
  type EquipmentItem,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EquipmentItemModel extends Document implements EquipmentItem {
  declare _id: string;
  @Prop({ required: true, index: true }) gymId: string;

  @Prop({ required: true }) name: string;

  @Prop({
    type: String,
    enum: EQUIPMENT_CATEGORIES,
    required: true,
  })
  category: EquipmentCategory;

  @Prop() description?: string;

  @Prop({ type: [String], default: [] }) images?: string[];

  @Prop({ required: true, min: 0 }) quantity: number;

  @Prop({
    type: String,
    enum: EQUIPMENT_CONDITIONS,
    default: 'good',
  })
  condition: EquipmentCondition;

  // Specs
  @Prop() brand?: string;
  @Prop() modelNumber?: string;
  @Prop() serialNumber?: string;

  // Management info
  @Prop() purchasePrice?: number;
  @Prop() purchaseDate?: Date;
  @Prop() vendor?: string;
  @Prop() warrantyExpiry?: Date;

  // Maintenance
  @Prop() lastServiceDate?: Date;
  @Prop() nextServiceDueDate?: Date;

  @Prop() notes?: string;

  // Audit
  @Prop() createdBy?: string;
  @Prop() updatedBy?: string;

  // Timestamps provided by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const EquipmentItemSchema =
  SchemaFactory.createForClass(EquipmentItemModel);
