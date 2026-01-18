import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GymCoachAffiliationDocument = GymCoachAffiliation & Document;

export enum AffiliationStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  DECLINED = 'declined',
}

@Schema({ timestamps: true })
export class GymCoachAffiliation {
  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true })
  gymId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  coachId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AffiliationStatus),
    default: AffiliationStatus.PENDING,
  })
  status: AffiliationStatus;

  @Prop({ type: String, enum: ['gym', 'coach'], required: true })
  initiatedBy: 'gym' | 'coach';

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({
    type: {
      canScheduleSessions: { type: Boolean, default: true },
      canAccessFacilities: { type: Boolean, default: true },
    },
    default: { canScheduleSessions: true, canAccessFacilities: true },
  })
  permissions: {
    canScheduleSessions: boolean;
    canAccessFacilities: boolean;
  };

  @Prop({ type: Boolean, default: false })
  isExclusive: boolean;

  @Prop({ type: Number, min: 0, max: 100 })
  commissionRate?: number;

  @Prop({ type: String })
  message?: string;
}

export const GymCoachAffiliationSchema =
  SchemaFactory.createForClass(GymCoachAffiliation);

// Compound index to ensure unique gym-coach pairs
GymCoachAffiliationSchema.index({ gymId: 1, coachId: 1 }, { unique: true });
