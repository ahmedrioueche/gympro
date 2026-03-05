import { GymManagerFeature } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AppFeaturePackageModel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, default: {} })
  localizedName: Record<string, string>; // { en: "...", fr: "...", ar: "..." }

  @Prop({ type: [String], required: true, enum: GymManagerFeature })
  features: GymManagerFeature[];

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const AppFeaturePackageSchema = SchemaFactory.createForClass(
  AppFeaturePackageModel,
);
