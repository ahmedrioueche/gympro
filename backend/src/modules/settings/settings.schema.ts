import type {
  AppSettings,
  BillingSettings,
  FeaturesSettings,
  LocaleSettings,
  NotificationSettings,
  ThemeOption,
} from '@ahmedrioueche/gympro-client';
import { THEME_OPTIONS } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class NotificationSettingsModel implements NotificationSettings {
  @Prop({ required: true, default: true }) enablePush: boolean;
  @Prop({ required: true, default: true }) enableEmail: boolean;
  @Prop({ min: 0 }) defaultReminderMinutes?: number;
}

@Schema({ _id: false })
export class BillingSettingsModel implements BillingSettings {
  @Prop({ required: true, default: 'USD' }) defaultCurrency: string;
  @Prop({ required: true, default: false }) autoRenewEnabled: boolean;
  @Prop({ min: 0 }) trialDays?: number;
}

@Schema({ _id: false })
export class FeaturesSettingsModel implements FeaturesSettings {
  @Prop({ required: true, default: true }) enableTrainingPrograms: boolean;
  @Prop({ required: true, default: true }) enableEquipmentInventory: boolean;
  @Prop({ required: true, default: true }) enableCoachAssignments: boolean;
  @Prop({ required: true, default: true }) enableAttendanceTracking: boolean;
  @Prop({ required: true, default: true }) enableGymBookings: boolean;
}

@Schema({ _id: false })
export class LocaleSettingsModel implements LocaleSettings {
  @Prop({ required: true, default: 'en' }) language: string;
  @Prop() timezone?: string;
}

@Schema({ timestamps: true })
export class AppSettingsModel extends Document implements AppSettings {
  @Prop({
    type: String,
    required: true,
    enum: THEME_OPTIONS,
    default: 'auto',
  })
  theme: ThemeOption;

  @Prop({ type: NotificationSettingsModel, required: true })
  notifications: NotificationSettings;

  @Prop({ type: BillingSettingsModel, required: true })
  billing: BillingSettings;

  @Prop({ type: FeaturesSettingsModel, required: true })
  features: FeaturesSettings;

  @Prop({ type: LocaleSettingsModel })
  locale?: LocaleSettings;

  @Prop({ required: true }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettingsModel);
