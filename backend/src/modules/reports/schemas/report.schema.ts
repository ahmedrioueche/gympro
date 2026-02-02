import { User } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReportType {
  ISSUE = 'issue',
  FEEDBACK = 'feedback',
  FEATURE_REQUEST = 'feature_request',
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ReportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ReportType })
  type: ReportType;

  @Prop({ required: true, enum: ReportPriority, default: ReportPriority.LOW })
  priority: ReportPriority;

  @Prop({ required: true, enum: ReportStatus, default: ReportStatus.OPEN })
  status: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter: User | Types.ObjectId;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
