import type {
  AppPlan,
  AppPlanLevel,
  AppPlanType,
  AppSubscription,
  AppSubscriptionBillingCycle,
  AppSubscriptionStatus,
  AutoRenewType,
  PaymentMethod,
  SupportedCurrency,
} from '@ahmedrioueche/gympro-client';
import {
  APP_PLAN_LEVELS,
  APP_PLAN_TYPES,
  APP_SUBSCRIPTION_AUTO_RENEW_TYPES,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  APP_SUBSCRIPTION_HISTORY_ACTIONS,
  APP_SUBSCRIPTION_STATUSES,
  PAYMENT_METHODS,
  SUPPORTED_CURRENCIES,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

// ---------------------
// Nested Schemas
// ---------------------

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

// Multi-currency pricing map
export type AppPlanPricingMap = {
  [key in SupportedCurrency]?: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
  };
};

const CurrencyPricingSchema = new MongooseSchema(
  {
    monthly: { type: Number },
    yearly: { type: Number },
    oneTime: { type: Number },
  },
  { _id: false },
);

const AppPlanPricingSchema = new MongooseSchema(
  SUPPORTED_CURRENCIES.reduce(
    (acc, currency) => {
      acc[currency] = { type: CurrencyPricingSchema };
      return acc;
    },
    {} as Record<SupportedCurrency, any>,
  ),
  { _id: false },
);

const ChargilyPriceIdsSchema = new MongooseSchema(
  APP_SUBSCRIPTION_BILLING_CYCLES.reduce(
    (acc, cycle) => {
      acc[cycle] = { type: String };
      return acc;
    },
    {} as Record<AppSubscriptionBillingCycle, any>,
  ),
  {
    _id: false,
    strict: 'throw', // 🔥 rejects unknown keys
  },
);

// ---------------------
// AppPlan Schema
// ---------------------

@Schema({ timestamps: true })
export class AppPlanModel extends Document implements AppPlan {
  declare _id: string;

  @Prop({ required: true, unique: true, type: String })
  planId: string;

  @Prop({ default: 1 })
  version?: number;

  @Prop()
  order?: number;

  @Prop({ type: String, required: true, enum: APP_PLAN_TYPES })
  type: AppPlanType;

  @Prop({ type: String, required: true, enum: APP_PLAN_LEVELS })
  level: AppPlanLevel;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: AppPlanPricingSchema, required: true })
  pricing: AppPlanPricingMap;

  @Prop()
  paddleProductId: string;

  @Prop({ type: Object })
  paddlePriceIds: {
    monthly?: string;
    yearly?: string;
    oneTime?: string;
  };

  @Prop({ type: AppPlanLimits, required: true })
  limits: AppPlanLimits;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  trialDays?: number;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const AppPlanSchema = SchemaFactory.createForClass(AppPlanModel);
AppPlanSchema.index({ level: 1, type: 1 });
AppPlanSchema.index({ planId: 1 });

// ---------------------
// Trial Info Schema
// ---------------------

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

// ---------------------
// AddOns Schema
// ---------------------

@Schema({ _id: false })
class AddOns {
  @Prop({ min: 0 })
  members?: number;

  @Prop({ min: 0 })
  gyms?: number;

  @Prop({ min: 0 })
  gems?: number;
}

// ---------------------
// AppSubscription Schema
// ---------------------

@Schema({ timestamps: true })
export class AppSubscriptionModel extends Document implements AppSubscription {
  declare _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: String }) // reference by planId
  planId: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Date, required: true })
  currentPeriodStart: Date;

  @Prop({ type: Date, required: true })
  currentPeriodEnd: Date;

  @Prop({ type: String, required: true, enum: APP_SUBSCRIPTION_STATUSES })
  status: AppSubscriptionStatus;

  @Prop({ type: String, enum: PAYMENT_METHODS })
  paymentMethod?: PaymentMethod;

  @Prop()
  autoRenew?: boolean;

  @Prop({ type: String, enum: APP_SUBSCRIPTION_AUTO_RENEW_TYPES })
  autoRenewType?: AutoRenewType;

  @Prop({ type: String, enum: APP_SUBSCRIPTION_BILLING_CYCLES })
  billingCycle?: AppSubscriptionBillingCycle;

  @Prop({ type: Date })
  lastPaymentDate?: Date;

  @Prop({ type: Date })
  nextPaymentDate?: Date;

  @Prop({ type: TrialInfo })
  trial?: TrialInfo;

  @Prop({ type: [AddOns] })
  addOns?: AddOns[];

  @Prop()
  cancelledAt?: string;

  @Prop()
  cancelAtPeriodEnd?: boolean;

  @Prop()
  cancellationReason?: string;

  @Prop({ type: String })
  pendingPlanId?: string;

  @Prop({ type: String, enum: APP_SUBSCRIPTION_BILLING_CYCLES })
  pendingBillingCycle?: AppSubscriptionBillingCycle;

  @Prop({ type: Date })
  pendingChangeEffectiveDate?: Date;

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
AppSubscriptionSchema.index({ userId: 1, status: 1 });
AppSubscriptionSchema.index({ status: 1, endDate: 1 });
AppSubscriptionSchema.index({ planId: 1 });

// ---------------------
// AppSubscriptionHistory Schema
// ---------------------

@Schema({ timestamps: true })
export class AppSubscriptionHistoryModel extends Document {
  declare _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'AppSubscription' })
  subscriptionId: string;

  @Prop({ required: true, type: String })
  planId: string;

  @Prop({
    type: String,
    required: true,
    enum: APP_SUBSCRIPTION_HISTORY_ACTIONS,
  })
  action: string;

  @Prop({ type: Date, required: true })
  startDate: string | Date;

  @Prop({ type: Date })
  endDate?: string | Date;

  @Prop({ type: String, required: true, enum: APP_SUBSCRIPTION_STATUSES })
  status: AppSubscriptionStatus;

  @Prop({ min: 0 })
  amountPaid?: number;

  @Prop({ type: String, enum: SUPPORTED_CURRENCIES })
  currency?: SupportedCurrency;

  @Prop({ type: String, enum: PAYMENT_METHODS })
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

AppSubscriptionHistorySchema.index({ userId: 1, createdAt: -1 });
AppSubscriptionHistorySchema.index({ subscriptionId: 1 });
AppSubscriptionHistorySchema.index({ planId: 1 });
