import type {
  AppLanguage,
  AppSettings,
  LocaleSettings,
  NotificationSettings,
  ThemeOption,
  TimerSettings,
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
  @Prop({ type: String, enum: ['kg', 'lbs'], default: 'kg' }) weightUnit:
    | 'kg'
    | 'lbs';
  @Prop() timezone?: string;
  @Prop() region?: string;
  @Prop() regionName?: string;
}

@Schema({ _id: false })
export class TimerSettingsModel implements TimerSettings {
  @Prop({ required: true, default: 90 }) defaultRestTime: number;
  @Prop({ required: true, default: 'beep' }) sound:
    | 'beep'
    | 'vibrate'
    | 'silent';
  @Prop({ default: 'beep_1' }) soundTrack?: string;
  @Prop({ required: true, default: 3 }) alarmDuration: number;
  @Prop({ default: 5 }) warningSeconds?: number;
  @Prop({ default: 'beep_1' }) warningSoundTrack?: string;
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

  @Prop({ type: TimerSettingsModel, default: {} })
  timer?: TimerSettings;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettingsModel);
