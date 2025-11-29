import type {
  BaseSubscriptionType,
  Gym,
  PaymentMethod,
  SubscriptionHistory,
  SubscriptionInfo,
  SubscriptionPeriodUnit,
  SubscriptionStatus,
  SubscriptionType,
} from '@ahmedrioueche/gympro-client';
import {
  BASE_SUBSCRIPTION_TYPES,
  PAYMENT_METHODS,
  SUBSCRIPTION_PERIOD_UNITS,
  SUBSCRIPTION_STATUSES,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class SubscriptionInfoModel implements SubscriptionInfo {
  @Prop({ required: true }) typeId: string;
  @Prop({ required: true }) startDate: string;
  @Prop({ required: true }) endDate: string;
  @Prop({
    type: String,
    required: true,
    enum: SUBSCRIPTION_STATUSES,
  })
  status: SubscriptionStatus;
  @Prop({
    type: String,
    enum: PAYMENT_METHODS,
  })
  paymentMethod?: PaymentMethod;
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
  @Prop({
    type: String,
    required: true,
    enum: BASE_SUBSCRIPTION_TYPES,
  })
  baseType: BaseSubscriptionType;
  @Prop() customName?: string;
  @Prop() description?: string;
  @Prop({ required: true }) price: number;
  @Prop({ required: true }) duration: number;
  @Prop({
    type: String,
    required: true,
    enum: SUBSCRIPTION_PERIOD_UNITS,
  })
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
  subscription: SubscriptionInfo;
  @Prop({ type: Object, required: true }) gym: Gym;
  @Prop() handledBy?: string;
  @Prop() notes?: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}

export const SubscriptionHistorySchema = SchemaFactory.createForClass(
  SubscriptionHistoryModel,
);
