import {
  APP_PAYMENT_STATUSES,
  AppPaymentProvider,
  AppPaymentStatus,
  SupportedCurrency,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AppPaymentModel extends Document {
  declare _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'AppSubscription' })
  subscriptionId: string;

  @Prop({ required: true, type: String })
  planId: string;

  @Prop({ required: true, type: Number, min: 0 })
  amount: number;

  @Prop({ required: true, type: String })
  currency: SupportedCurrency;

  @Prop({
    required: true,
    type: String,
    enum: APP_PAYMENT_STATUSES,
    default: 'pending',
  })
  status: AppPaymentStatus;

  @Prop({ required: true, type: String })
  provider: AppPaymentProvider;

  @Prop({ required: true, type: String, unique: true })
  providerTransactionId: string;

  @Prop({ type: String })
  providerCustomerId?: string;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({ type: Date })
  refundedAt?: Date;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const AppPaymentSchema = SchemaFactory.createForClass(AppPaymentModel);

// Indexes for efficient querying
AppPaymentSchema.index({ userId: 1, createdAt: -1 });
AppPaymentSchema.index({ subscriptionId: 1 });
AppPaymentSchema.index({ providerTransactionId: 1 });
AppPaymentSchema.index({ status: 1, paidAt: -1 });
AppPaymentSchema.index({ provider: 1, status: 1 });
