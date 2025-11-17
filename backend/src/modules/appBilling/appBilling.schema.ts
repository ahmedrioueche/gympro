import type {
  AppPlan,
  AppPlanType,
  AppSubscription,
  AppSubscriptionStatus,
  PaymentMethod,
} from '@ahmedrioueche/gympro-client';
import {
  APP_PLAN_TYPES,
  APP_SUBSCRIPTION_STATUSES,
  PAYMENT_METHODS,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AppPlanModel extends Document implements AppPlan {
  @Prop() declare _id: string;

  @Prop({ required: true }) name: string;

  @Prop({
    type: String,
    required: true,
    enum: APP_PLAN_TYPES,
  })
  type: AppPlanType;

  @Prop() description?: string;

  @Prop({ required: true, min: 0 }) priceMonthly: number;

  @Prop({ min: 0 }) priceYearly?: number;

  @Prop({ type: [String], required: true }) features: string[];

  @Prop({ min: 1 }) maxGyms?: number;

  @Prop({ min: 1 }) maxMembers?: number;

  @Prop({ required: true }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

export const AppPlanSchema = SchemaFactory.createForClass(AppPlanModel);

@Schema({ timestamps: true })
export class AppSubscriptionModel extends Document implements AppSubscription {
  @Prop({ required: true }) gymId: string;

  @Prop({ required: true }) planId: string;

  @Prop({ required: true }) startDate: string;

  @Prop() endDate?: string;

  @Prop({
    type: String,
    required: true,
    enum: APP_SUBSCRIPTION_STATUSES,
  })
  status: AppSubscriptionStatus;

  @Prop({ default: false }) trial?: boolean;

  @Prop({
    type: String,
    enum: PAYMENT_METHODS,
  })
  paymentMethod?: PaymentMethod;

  @Prop({ default: false }) autoRenew?: boolean;

  @Prop({ required: true }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

export const AppSubscriptionSchema =
  SchemaFactory.createForClass(AppSubscriptionModel);
