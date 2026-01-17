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

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: String, required: true, enum: Object.values(SessionType) })
  type: SessionType;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(SessionStatus),
    default: SessionStatus.SCHEDULED,
  })
  status: SessionStatus;

  @Prop()
  notes?: string;

  @Prop()
  meetingLink?: string;

  @Prop()
  location?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionModel);

// Indexes for efficient querying by date range and user
SessionSchema.index({ coachId: 1, startTime: 1 });
SessionSchema.index({ memberId: 1, startTime: 1 });
