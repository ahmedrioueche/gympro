import { CoachRequestStatus } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CoachRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  memberId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  coachId: Types.ObjectId;

  @Prop({ type: String })
  message?: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending',
  })
  status: CoachRequestStatus;

  @Prop({ type: Date })
  respondedAt?: Date;

  @Prop({ type: String })
  response?: string;

  // Timestamp fields (automatically added by Mongoose with timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

export const CoachRequestSchema = SchemaFactory.createForClass(CoachRequest);
export type CoachRequestModel = CoachRequest & Document;
