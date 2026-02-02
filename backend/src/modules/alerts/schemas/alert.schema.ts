import {
  AlertPriority,
  AlertSource,
  AlertStatus,
  AlertType,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: Object.values(AlertType),
    default: AlertType.INFO,
  })
  type: AlertType;

  @Prop({
    type: String,
    enum: Object.values(AlertPriority),
    default: AlertPriority.LOW,
  })
  priority: AlertPriority;

  @Prop({
    type: String,
    enum: Object.values(AlertStatus),
    default: AlertStatus.UNREAD,
  })
  status: AlertStatus;

  @Prop({
    type: String,
    enum: Object.values(AlertSource),
    default: AlertSource.INTERNAL,
  })
  source: AlertSource;

  @Prop()
  stackTrace?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// Add index for faster queries on source, type, and status
AlertSchema.index({ source: 1, type: 1, status: 1 });
AlertSchema.index({ createdAt: -1 });
