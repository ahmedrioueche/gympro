import {
  AccessControlType,
  AppSubscription,
  Currency,
  GymService,
  GymSettings,
  GymStats,
  PAYMENT_METHODS,
  PaymentMethod,
  TimeRange,
  WeeklyTimeRange,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class FacilityModel {
  declare _id: string;
  @Prop({ required: true }) name: string;
  @Prop() capacity?: number;
  @Prop() description?: string;
  @Prop() createdAt: Date;
}
export const FacilitySchema = SchemaFactory.createForClass(FacilityModel);

@Schema({ _id: false })
export class ReminderIntervalsModel {
  @Prop({ default: true }) day3?: boolean;
  @Prop({ default: true }) day1?: boolean;
  @Prop({ default: true }) today?: boolean;
  @Prop({ default: true }) day7?: boolean;
  @Prop({ default: true }) day30?: boolean;
  @Prop({ default: true }) day60?: boolean;
  @Prop({ default: true }) day90?: boolean;
}

@Schema({ _id: false })
export class ReminderSettingsModel {
  @Prop({ type: Object, default: { day3: true, day1: true, today: true } })
  preExpiry?: {
    day3?: boolean;
    day1?: boolean;
    today?: boolean;
  };

  @Prop({
    type: Object,
    default: {
      day3: true,
      day7: true,
      day30: true,
      day60: true,
      day90: true,
    },
  })
  postExpiry?: {
    day3?: boolean;
    day7?: boolean;
    day30?: boolean;
    day60?: boolean;
    day90?: boolean;
  };
}
const ReminderSettingsSchema = SchemaFactory.createForClass(
  ReminderSettingsModel,
);

@Schema({ _id: false })
export class GymSettingsModel implements GymSettings {
  @Prop({ type: [String], enum: Object.values(PAYMENT_METHODS), default: [] })
  paymentMethods: PaymentMethod[];
  @Prop() allowCustomSubscriptions?: boolean;
  @Prop() notificationsEnabled?: boolean;
  @Prop() notifyExpiringMembers?: boolean;
  @Prop({ type: ReminderSettingsSchema, default: () => ({}) })
  reminderSettings?: ReminderSettingsModel;

  @Prop({ type: Number })
  subscriptionRenewalReminderDays?: number;
  @Prop({ type: Object }) workingHours?: TimeRange;
  @Prop() useAdvancedHours?: boolean;
  @Prop({ type: [Object] }) customWorkingHours?: WeeklyTimeRange[];
  @Prop() isMixed?: boolean;
  @Prop({ type: [Object] }) femaleOnlyHours?: WeeklyTimeRange[];
  @Prop() notifyScheduleChanges?: boolean;
  @Prop({ type: [Object], default: [] }) servicesOffered?: GymService[];
  @Prop({ type: String, default: 'flexible' })
  accessControlType?: AccessControlType;
  @Prop({ type: String })
  defaultCurrency?: Currency;
  @Prop({ type: [String], default: [] }) rules?: string[];
  @Prop({ type: [Object], default: [] }) temporaryClosures?: any[];
  @Prop({ type: [Number], default: [0, 1, 2, 3, 4, 5, 6] })
  workingDays?: number[];
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

  @Prop({ type: GymSettingsSchema }) settings?: GymSettings;
  @Prop({ type: GymStatsSchema }) memberStats?: GymStats;
  @Prop({ type: Object }) appSubscription?: AppSubscription;
  @Prop({
    type: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video', 'document'] },
        category: {
          type: String,
          enum: ['marketing', 'facility', 'class', 'social'],
        },
        title: String,
        description: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  media?: any[];

  @Prop({ type: [FacilitySchema], default: [] })
  facilities?: FacilityModel[];

  @Prop()
  bannerUrl?: string;

  @Prop()
  bannerPublicId?: string;
  @Prop() createdAt: Date;
  @Prop() latitude?: number;
  @Prop() longitude?: number;
}
export const GymSchema = SchemaFactory.createForClass(GymModel);
