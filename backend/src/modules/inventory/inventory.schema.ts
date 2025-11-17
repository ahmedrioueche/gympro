import type { EquipmentItem } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EQUIPMENT_CONDITIONS,
  EquipmentCondition,
} from '@ahmedrioueche/gympro-client';
@Schema({ timestamps: true })
export class EquipmentItemModel extends Document implements EquipmentItem {
  @Prop() declare _id: string;

  @Prop({ required: true }) gymId: string;

  @Prop({ required: true }) name: string;

  @Prop({ required: true }) type: string;

  @Prop({ required: true, min: 0 }) quantity: number;

  @Prop({
    type: String,
    enum: EQUIPMENT_CONDITIONS,
  })
  condition?: EquipmentCondition;

  @Prop() notes?: string;

  @Prop({ required: true }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

export const EquipmentItemSchema =
  SchemaFactory.createForClass(EquipmentItemModel);
