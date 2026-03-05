import type {
  ClassBooking,
  classBookingStatus,
  GymClass,
} from '@ahmedrioueche/gympro-client';
import { CLASS_BOOKING_STATUSES } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ClassBookingModel implements ClassBooking {
  _id: string;
  @Prop({ required: true })
  classId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({
    type: String,
    required: true,
    enum: CLASS_BOOKING_STATUSES,
  })
  status: classBookingStatus;

  @Prop({ type: Date, required: true })
  bookedAt: string | Date;

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

@Schema({ timestamps: true })
export class GymClassModel extends Document implements GymClass {
  declare _id: string;

  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true, index: true })
  gymId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  service: string; // The service type this class belongs to (e.g., 'yoga', 'crossfit')

  @Prop({ type: Types.ObjectId, ref: 'User' })
  coachId?: string;

  @Prop({ type: String })
  facilityId?: string;

  @Prop({ required: true, min: 1 })
  maxCapacity: number;

  @Prop({ type: Date, required: true, index: true })
  scheduledAt: string | Date;

  @Prop({ type: Date, index: true })
  originalScheduledAt?: string | Date; // Used to track which recurrence slot this instance belongs to

  @Prop({ required: true, min: 1 })
  duration: number; // in minutes

  @Prop({ type: [ClassBookingModel], default: [] })
  bookings: ClassBooking[];

  @Prop({
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  })
  status: 'active' | 'cancelled' | 'completed';

  @Prop({ type: Object })
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    endDate?: string | Date;
    days?: number[];
  };

  @Prop({ type: String, index: true })
  seriesId?: string;

  @Prop({ default: false })
  isSeries: boolean;

  @Prop({
    type: [
      {
        itemId: {
          type: Types.ObjectId,
          ref: 'EquipmentItemModel',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    default: [],
  })
  equipment?: { itemId: string; quantity: number }[];

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const GymClassSchema = SchemaFactory.createForClass(GymClassModel);
