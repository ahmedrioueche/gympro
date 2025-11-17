import type {
  Invoice,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
  PaymentTransaction,
} from '@ahmedrioueche/gympro-client';
import {
  INVOICE_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PAYMENT_TARGET_TYPES,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PaymentTransactionModel implements PaymentTransaction {
  @Prop({ required: true }) targetId: string;
  @Prop({ required: true, enum: PAYMENT_TARGET_TYPES })
  targetType: PaymentTargetType;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) currency: string;
  @Prop({ required: true }) date: string;
  @Prop({ required: true, enum: PAYMENT_STATUSES }) status: PaymentStatus;
  @Prop({ required: true, enum: PAYMENT_METHODS }) method: PaymentMethod;
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
  @Prop({ required: true, enum: PAYMENT_TARGET_TYPES })
  targetType: PaymentTargetType;
  @Prop({ required: true }) invoiceNumber: string;
  @Prop({ required: true }) issuedAt: string;
  @Prop() dueDate?: string;
  @Prop({ required: true }) totalAmount: number;
  @Prop({ required: true }) currency: string;
  @Prop({ type: [PaymentTransactionSchema], default: [] })
  payments: PaymentTransactionModel[];
  @Prop({ required: true, enum: INVOICE_STATUSES }) status: InvoiceStatus;
  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
}
export const InvoiceSchema = SchemaFactory.createForClass(InvoiceModel);
