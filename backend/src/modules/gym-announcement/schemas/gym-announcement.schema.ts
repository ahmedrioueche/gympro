import { GymAnnouncement } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GymAnnouncementDocument = GymAnnouncementModel & Document;

@Schema({ timestamps: true })
export class GymAnnouncementModel
  implements Omit<GymAnnouncement, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true })
  gymId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    required: true,
    enum: ['normal', 'high', 'critical'],
    default: 'normal',
  })
  priority: 'normal' | 'high' | 'critical';

  @Prop({
    type: String,
    required: true,
    enum: ['all', 'members', 'staff'],
    default: 'all',
  })
  targetAudience: 'all' | 'members' | 'staff';

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: { _id: { type: Types.ObjectId, ref: 'User' }, name: String },
    required: true,
  })
  author: {
    _id: string;
    name: string;
  };
}

export const GymAnnouncementSchema =
  SchemaFactory.createForClass(GymAnnouncementModel);

// Indexes for efficient querying by gym and active status
GymAnnouncementSchema.index({ gymId: 1, isActive: 1, createdAt: -1 });
