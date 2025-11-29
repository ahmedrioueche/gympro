import type {
  AppSubscription,
  BaseSubscriptionType,
  GymSettings,
  GymStats,
  PaymentMethod,
  TimeRange,
  WeeklyTimeRange,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class GymSettingsModel implements GymSettings {
  @Prop() paymentMethods: PaymentMethod[];
  @Prop() allowCustomSubscriptions?: boolean;
  @Prop() notificationsEnabled?: boolean;
  @Prop() subscriptionRenewalReminderDays?: number;
  @Prop({ type: Object }) workingHours?: TimeRange;
  @Prop() isMixed?: boolean;
  @Prop({ type: [Object] }) femaleOnlyHours?: WeeklyTimeRange[];
  @Prop({ type: [String] }) servicesOffered?: BaseSubscriptionType[];
}
export const GymSettingsSchema = SchemaFactory.createForClass(GymSettingsModel);

@Schema({ _id: false })
export class GymStatsModel implements GymStats {
  @Prop({ default: 0 }) total: number;
  @Prop({ default: 0 }) checkedIn: number;
  @Prop({ default: 0 }) withActiveSubscriptions: number;
  @Prop({ default: 0 }) withExpiredSubscriptions: number;
  @Prop({ default: 0 }) pendingApproval: number;
}
export const GymStatsSchema = SchemaFactory.createForClass(GymStatsModel);

@Schema({ timestamps: true })
export class GymModel extends Document {
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
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
  @Prop() defaultCurrency?: string;
  @Prop({ type: GymSettingsSchema }) settings?: GymSettings;
  @Prop({ type: GymStatsSchema }) memberStats?: GymStats;
  @Prop({ type: Object }) appSubscription?: AppSubscription;
  @Prop() createdAt: Date;
  @Prop() latitude?: number;
  @Prop() longitude?: number;
}
export const GymSchema = SchemaFactory.createForClass(GymModel);
