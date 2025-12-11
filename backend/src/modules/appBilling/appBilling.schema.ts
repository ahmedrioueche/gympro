import type {
  AppCurrency,
  AppPlan,
  AppPlanLevel,
  AppPlanType,
  AppSubscription,
  AppSubscriptionStatus,
  PaymentMethod,
} from '@ahmedrioueche/gympro-client';
import {
  APP_CURRENCIES,
  APP_PLAN_LEVELS,
  APP_PLAN_TYPES,
  APP_SUBSCRIPTION_STATUSES,
  PAYMENT_METHODS,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Nested schemas
@Schema({ _id: false })
class AppPlanPricing {
  @Prop({ min: 0 })
  monthly?: number;

  @Prop({ min: 0 })
  yearly?: number;

  @Prop({ min: 0 })
  oneTime?: number;
}

@Schema({ _id: false })
class AppPlanLimits {
  @Prop({ min: 1 })
  maxGyms?: number;

  @Prop({ min: 1 })
  maxMembers?: number;

  @Prop({ min: 0 })
  maxGems?: number;
}

@Schema({ timestamps: true })
export class AppPlanModel extends Document implements AppPlan {
  declare _id: string;

  @Prop({ default: 1 })
  version?: number;

  @Prop()
  order?: number;

  @Prop({
    type: String,
    required: true,
    enum: APP_PLAN_TYPES,
  })
  type: AppPlanType;

  @Prop({
    type: String,
    required: true,
    enum: APP_PLAN_LEVELS,
  })
  level: AppPlanLevel;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    required: true,
    enum: APP_CURRENCIES,
  })
  currency: AppCurrency;

  @Prop({ type: AppPlanPricing, required: true })
  pricing: AppPlanPricing;

  @Prop({ type: AppPlanLimits, required: true })
  limits: AppPlanLimits;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  trialDays: number;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const AppPlanSchema = SchemaFactory.createForClass(AppPlanModel);

// Trial nested schema
@Schema({ _id: false })
class TrialInfo {
  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ required: true, default: true })
  hasUsedTrial: boolean;

  @Prop()
  convertedToPaid?: boolean;
}

// AddOns nested schema
@Schema({ _id: false })
class AddOns {
  @Prop({ min: 0 })
  members?: number;

  @Prop({ min: 0 })
  gyms?: number;

  @Prop({ min: 0 })
  gems?: number;
}

@Schema({ timestamps: true })
export class AppSubscriptionModel extends Document implements AppSubscription {
  declare _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'AppPlanModel' })
  planId: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({
    type: String,
    required: true,
    enum: APP_SUBSCRIPTION_STATUSES,
  })
  status: AppSubscriptionStatus;

  @Prop({
    type: String,
    enum: PAYMENT_METHODS,
  })
  paymentMethod?: PaymentMethod;

  @Prop({ default: false })
  autoRenew?: boolean;

  @Prop({
    type: String,
    enum: ['monthly', 'yearly', 'oneTime'],
  })
  billingCycle?: 'monthly' | 'yearly' | 'oneTime';

  @Prop()
  lastPaymentDate?: string;

  @Prop()
  nextPaymentDate?: string;

  @Prop({ type: TrialInfo })
  trial?: TrialInfo;

  @Prop({ type: [AddOns] })
  addOns?: AddOns[];

  @Prop()
  cancelledAt?: string;

  @Prop()
  cancellationReason?: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const AppSubscriptionSchema =
  SchemaFactory.createForClass(AppSubscriptionModel);

// Add indexes for better query performance
AppSubscriptionSchema.index({ userId: 1, status: 1 });
AppSubscriptionSchema.index({ status: 1, endDate: 1 }); // For finding expiring trials
AppPlanSchema.index({ level: 1, type: 1 });

// AppSubscriptionHistory Schema
@Schema({ timestamps: true })
export class AppSubscriptionHistoryModel extends Document {
  declare _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'AppSubscription' })
  subscriptionId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'AppPlanModel' })
  planId: string;

  @Prop({
    type: String,
    required: true,
    enum: [
      'created',
      'upgraded',
      'downgraded',
      'renewed',
      'cancelled',
      'expired',
      'reactivated',
      'trial_started',
      'trial_converted',
      'trial_expired',
    ],
  })
  action: string;

  @Prop({ type: Date, required: true })
  startDate: string | Date;

  @Prop({ type: Date })
  endDate?: string | Date;

  @Prop({
    type: String,
    required: true,
    enum: APP_SUBSCRIPTION_STATUSES,
  })
  status: AppSubscriptionStatus;

  @Prop({ min: 0 })
  amountPaid?: number;

  @Prop({
    type: String,
    enum: APP_CURRENCIES,
  })
  currency?: AppCurrency;

  @Prop({
    type: String,
    enum: PAYMENT_METHODS,
  })
  paymentMethod?: PaymentMethod;

  @Prop()
  wasTrial?: boolean;

  @Prop()
  notes?: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const AppSubscriptionHistorySchema = SchemaFactory.createForClass(
  AppSubscriptionHistoryModel,
);

// Add indexes for history queries
AppSubscriptionHistorySchema.index({ userId: 1, createdAt: -1 });
AppSubscriptionHistorySchema.index({ subscriptionId: 1 });
