import type {
  AppLanguage,
  AppSettings,
  LocaleSettings,
  NotificationSettings,
  ThemeOption,
  ViewPreference,
} from '@ahmedrioueche/gympro-client';
import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  THEME_OPTIONS,
  VIEW_PREFERENCES,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class NotificationSettingsModel implements NotificationSettings {
  @Prop({ min: 0 }) defaultReminderMinutes?: number;
}

@Schema({ _id: false })
export class LocaleSettingsModel implements LocaleSettings {
  @Prop({ required: true, default: DEFAULT_LANGUAGE }) language: AppLanguage;
  @Prop({ required: true, default: DEFAULT_CURRENCY })
  currency: string;
  @Prop() timezone?: string;
  @Prop() region?: string;
  @Prop() regionName?: string;
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

  @Prop({
    type: String,
    required: true,
    enum: VIEW_PREFERENCES,
    default: 'table',
  })
  viewPreference: ViewPreference;

  @Prop({ type: NotificationSettingsModel, default: {} })
  notifications?: NotificationSettings;

  @Prop({ type: LocaleSettingsModel })
  locale?: LocaleSettings;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettingsModel);
