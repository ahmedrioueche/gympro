import {
  Session,
  SessionStatus,
  SessionType,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SessionModel extends Document implements Session {
  declare _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  coachId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  memberId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true, min: 1 })
  duration: number; // in minutes

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: String, required: true, enum: SessionType })
  type: SessionType;

  @Prop({
    type: String,
    required: true,
    enum: SessionStatus,
    default: SessionStatus.SCHEDULED,
  })
  status: SessionStatus;

  @Prop()
  notes?: string;

  @Prop()
  meetingLink?: string;

  @Prop()
  location?: string;

  @Prop({ type: String })
  facilityId?: string;

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: String })
  currency?: string;

  @Prop({ type: Types.ObjectId, ref: 'GymModel' })
  gymId?: string;

  @Prop({ type: Object })
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    endDate?: string | Date;
    days?: number[];
  };

  @Prop({ type: String, index: true })
  seriesId?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionModel);

// Indexes for efficient querying by date range and user
SessionSchema.index({ coachId: 1, startTime: 1 });
SessionSchema.index({ memberId: 1, startTime: 1 });
