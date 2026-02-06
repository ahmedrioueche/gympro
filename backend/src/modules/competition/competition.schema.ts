import {
  COMPETITION_STATUSES,
  COMPETITION_TYPES,
  CompetitionStatus,
  CompetitionType,
  type Competition,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CompetitionModel extends Document implements Competition {
  declare _id: string;

  @Prop({ required: true, index: true })
  gymId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: COMPETITION_TYPES,
    required: true,
  })
  type: CompetitionType;

  @Prop({
    type: String,
    enum: COMPETITION_STATUSES,
    default: 'active',
  })
  status: CompetitionStatus;

  @Prop({
    type: String,
    enum: ['interval', 'fixed'],
    default: 'interval',
  })
  schedulingMode: 'interval' | 'fixed';

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  eventTime?: Date; // For fixed scheduling mode - the exact event date/time

  @Prop()
  rules?: string;

  @Prop()
  prize?: string;

  @Prop()
  bannerImage?: string;

  @Prop({ min: 0 })
  maxParticipants?: number;

  @Prop({ default: 0, min: 0 })
  participantCount: number;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({
    type: [
      {
        place: { type: Number, enum: [1, 2, 3], required: true },
        userId: { type: String, required: true },
        userName: { type: String },
        userAvatar: { type: String },
      },
    ],
    default: [],
  })
  winners: {
    place: 1 | 2 | 3;
    userId: string;
    userName?: string;
    userAvatar?: string;
  }[];

  // Audit
  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;

  // Timestamps provided by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const CompetitionSchema = SchemaFactory.createForClass(CompetitionModel);

// Add index for searching
CompetitionSchema.index({ title: 'text', description: 'text' });
