import type {
  AttendanceRecord,
  AttendanceStatus,
} from '@ahmedrioueche/gympro-client';

import { ATTENDANCE_STATUSES } from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AttendanceRecordModel
  extends Document
  implements AttendanceRecord
{
  @Prop() declare _id: string;

  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true, index: true })
  gymId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ type: Date, required: true })
  checkIn: string | Date;

  @Prop({ type: Date })
  checkOut?: string | Date;

  @Prop({
    type: String,
    required: true,
    enum: ATTENDANCE_STATUSES,
  })
  status: AttendanceStatus;

  @Prop()
  notes?: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;
}

export const AttendanceRecordSchema = SchemaFactory.createForClass(
  AttendanceRecordModel,
);
