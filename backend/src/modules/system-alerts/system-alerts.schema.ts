import {
  type AppBanner,
  type TopBannerAction,
  type TopBannerActionType,
  type TopBannerVariant,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class SystemAlertActionModel implements TopBannerAction {
  @Prop({ type: String, enum: ['none', 'link', 'modal'], default: 'none' })
  type: TopBannerActionType;

  @Prop()
  payload?: string;
}

@Schema({ timestamps: true })
export class SystemAlertModel extends Document implements AppBanner {
  declare _id: string;

  // We use Map to handle dynamic language keys
  @Prop({ type: Map, of: String, default: {} })
  translations: Record<string, string>;

  @Prop({
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    required: true,
  })
  variant: TopBannerVariant;

  @Prop()
  color?: string;

  @Prop({ type: SystemAlertActionModel, default: { type: 'none' } })
  action: TopBannerAction;

  @Prop({ required: true, default: false })
  isRemovable: boolean;

  @Prop({ required: true, default: 0 })
  frequencyHours: number;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop()
  templateKey?: string;

  createdAt: string;
  updatedAt: string;
}

export const SystemAlertSchema = SchemaFactory.createForClass(SystemAlertModel);
