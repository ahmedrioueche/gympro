import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GymCoachPaymentDocument = GymCoachPayment & Document;

export enum GymCoachPaymentType {
  EARNING = 'earning',
  PAYOUT = 'payout',
  ADJUSTMENT = 'adjustment',
}

export enum GymCoachPaymentCategory {
  SESSION_COMMISSION = 'session_commission',
  MEMBERSHIP_COMMISSION = 'membership_commission',
  BASE_SALARY = 'base_salary',
  BONUS = 'bonus',
  TRANSFER = 'transfer',
}

export enum GymCoachPaymentStatus {
  PENDING = 'pending',
  CLEARED = 'cleared',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class GymCoachPayment {
  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true })
  gymId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  coachId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({
    type: String,
    enum: Object.values(GymCoachPaymentType),
    required: true,
  })
  type: GymCoachPaymentType;

  @Prop({
    type: String,
    enum: Object.values(GymCoachPaymentCategory),
    required: true,
  })
  category: GymCoachPaymentCategory;

  @Prop({
    type: String,
    enum: Object.values(GymCoachPaymentStatus),
    default: GymCoachPaymentStatus.PENDING,
  })
  status: GymCoachPaymentStatus;

  // Audit Trail
  @Prop({ type: Types.ObjectId })
  referenceId?: Types.ObjectId; // e.g., SessionID

  @Prop({ type: String })
  referenceType?: string; // 'Session', 'Subscription'

  @Prop()
  description?: string;

  @Prop({ type: Object })
  metadata?: {
    commissionRateSnapshot?: number;
    originalServicePrice?: number;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  paidAt?: Date;
}

export const GymCoachPaymentSchema =
  SchemaFactory.createForClass(GymCoachPayment);

// Indexes
GymCoachPaymentSchema.index({ gymId: 1, coachId: 1, createdAt: -1 });
GymCoachPaymentSchema.index({ coachId: 1, status: 1 });
