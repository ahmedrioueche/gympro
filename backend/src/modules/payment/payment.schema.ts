import type {
  Invoice,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
  PaymentTransaction,
} from '@client/types/payment';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const paymentStatuses = [
  'pending',
  'completed',
  'failed',
  'refunded',
  'partial',
] as const;
const paymentTargetTypes = [
  'app_subscription',
  'gym_subscription',
  'service',
] as const;
const invoiceStatuses = [
  'unpaid',
  'partially_paid',
  'paid',
  'refunded',
] as const;
const paymentMethods = ['cash', 'ccp', 'dahabia', 'card', 'paypal'] as const;

@Schema({ _id: false })
export class PaymentTransactionModel implements PaymentTransaction {
  @Prop({ required: true }) targetId: string;
  @Prop({ required: true, enum: paymentTargetTypes })
  targetType: PaymentTargetType;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) currency: string;
  @Prop({ required: true }) date: string;
  @Prop({ required: true, enum: paymentStatuses }) status: PaymentStatus;
  @Prop({ required: true, enum: paymentMethods }) method: PaymentMethod;
  @Prop() referenceId?: string;
  @Prop() notes?: string;
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const PaymentTransactionSchema = SchemaFactory.createForClass(
  PaymentTransactionModel,
);

@Schema({ timestamps: true })
export class InvoiceModel extends Document implements Invoice {
  @Prop() declare _id: string;
  @Prop({ required: true }) targetId: string;
  @Prop({ required: true, enum: paymentTargetTypes })
  targetType: PaymentTargetType;
  @Prop({ required: true }) invoiceNumber: string;
  @Prop({ required: true }) issuedAt: string;
  @Prop() dueDate?: string;
  @Prop({ required: true }) totalAmount: number;
  @Prop({ required: true }) currency: string;
  @Prop({ type: [PaymentTransactionSchema], default: [] })
  payments: PaymentTransactionModel[];
  @Prop({ required: true, enum: invoiceStatuses }) status: InvoiceStatus;
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const InvoiceSchema = SchemaFactory.createForClass(InvoiceModel);
