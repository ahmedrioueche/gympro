import type {
  BaseSubscriptionType,
  Gym,
  SubscriptionHistory,
  SubscriptionInfo,
  SubscriptionPeriodUnit,
  SubscriptionType,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const baseTypes = [
  'regular',
  'coached',
  'yoga',
  'crossfit',
  'pilates',
  'boxing',
  'sauna',
  'massage',
  'custom',
] as const;
const periodUnits = ['day', 'week', 'month', 'year'] as const;
const membershipStatuses = ['active', 'expired', 'cancelled'] as const;
const paymentMethods = ['cash', 'ccp', 'dahabia', 'card'] as const;

@Schema({ _id: false })
export class SubscriptionInfoModel implements SubscriptionInfo {
  @Prop({ required: true }) typeId: string;
  @Prop({ required: true }) startDate: string;
  @Prop({ required: true }) endDate: string;
  @Prop({ required: true, enum: membershipStatuses })
  status: SubscriptionInfo['status'];
  @Prop({ enum: paymentMethods })
  paymentMethod?: SubscriptionInfo['paymentMethod'];
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const SubscriptionInfoSchema = SchemaFactory.createForClass(
  SubscriptionInfoModel,
);

@Schema({ timestamps: true })
export class SubscriptionTypeModel
  extends Document
  implements SubscriptionType
{
  @Prop() declare _id: string;
  @Prop({ required: true }) gymId: string;
  @Prop({ required: true, enum: baseTypes }) baseType: BaseSubscriptionType;
  @Prop() customName?: string;
  @Prop() description?: string;
  @Prop({ required: true }) price: number;
  @Prop({ required: true }) duration: number;
  @Prop({ required: true, enum: periodUnits })
  durationUnit: SubscriptionPeriodUnit;
  @Prop({ required: true }) isAvailable: boolean;
  @Prop({ required: true }) createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const SubscriptionTypeSchema = SchemaFactory.createForClass(
  SubscriptionTypeModel,
);

@Schema({ timestamps: true })
export class SubscriptionHistoryModel
  extends Document
  implements SubscriptionHistory
{
  @Prop({ type: SubscriptionInfoSchema, required: true })
  subscription: SubscriptionInfoModel;
  @Prop({ type: Object, required: true }) gym: Gym;
  @Prop() handledBy?: string;
  @Prop() notes?: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const SubscriptionHistorySchema = SchemaFactory.createForClass(
  SubscriptionHistoryModel,
);
