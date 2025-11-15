import type {
  AppSubscription,
  BaseSubscriptionType,
  Gym,
  GymSettings,
  TimeRange,
  WeeklyTimeRange,
} from '@gympro/client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class GymSettingsModel implements GymSettings {
  @Prop() allowCustomSubscriptions?: boolean;
  @Prop() notificationsEnabled?: boolean;
  @Prop() subscriptionRenewalReminderDays?: number;
  @Prop({ type: Object }) workingHours?: TimeRange;
  @Prop() isMixed?: boolean;
  @Prop({ type: [Object] }) femaleOnlyHours?: WeeklyTimeRange[];
  @Prop({ type: [String] }) servicesOffered?: BaseSubscriptionType[];
}
export const GymSettingsSchema = SchemaFactory.createForClass(GymSettingsModel);

@Schema({ timestamps: true })
export class GymModel extends Document implements Gym {
  declare _id: string;
  @Prop({ required: true }) name: string;
  @Prop() address?: string;
  @Prop() city?: string;
  @Prop() state?: string;
  @Prop() country?: string;
  @Prop() phone?: string;
  @Prop() email?: string;
  @Prop() website?: string;
  @Prop() timezone?: string;
  @Prop() logoUrl?: string;
  @Prop() slogan?: string;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ required: true }) ownerId: string;
  @Prop() defaultCurrency?: string;
  @Prop({ type: GymSettingsSchema }) settings?: GymSettings;
  @Prop({ type: Object }) appSubscription?: AppSubscription;
  @Prop() createdAt: Date;
}
export const GymSchema = SchemaFactory.createForClass(GymModel);
