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
    default: 'draft',
  })
  status: CompetitionStatus;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

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
