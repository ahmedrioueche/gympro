import { UserRole } from '@client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true, timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  fullName?: string;

  @Prop()
  age?: string;

  @Prop()
  gender?: string;

  @Prop()
  profileImageUrl?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop({ default: false })
  isValidated?: boolean;

  @Prop({ default: false })
  isOnBoarded?: boolean;

  @Prop({ enum: UserRole, required: true })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  memberships: string[];

  @Prop({ type: [String], default: [] })
  notifications: string[];

  @Prop({ type: Object })
  gymAccess?: {
    canManageSubscriptions: boolean;
    canManageMembers: boolean;
    canManageStaff: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
