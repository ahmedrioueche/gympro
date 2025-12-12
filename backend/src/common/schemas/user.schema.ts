import type { AppCurrency, StaffType } from '@ahmedrioueche/gympro-client';
import {
  APP_CURRENCIES,
  STAFF_TYPES,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class NotificationSettingsSchema {
  @Prop({ default: true })
  enablePush: boolean;

  @Prop({ default: true })
  enableEmail: boolean;

  @Prop()
  defaultReminderMinutes?: number;
}

@Schema({ _id: false })
export class LocaleSettingsSchema {
  @Prop({ default: 'en' })
  language: string;

  @Prop()
  timezone?: string;
}

@Schema({ _id: false })
export class AppSettingsSchema {
  @Prop({ default: 'light', enum: ['light', 'dark', 'auto'] })
  theme: 'light' | 'dark' | 'auto';

  @Prop({ type: NotificationSettingsSchema })
  notifications: NotificationSettingsSchema;

  @Prop({ enum: APP_CURRENCIES, required: true })
  currency: AppCurrency;

  @Prop({ type: LocaleSettingsSchema })
  locale?: LocaleSettingsSchema;
}

@Schema({ _id: false, timestamps: false })
export class UserProfile {
  @Prop({ required: true })
  username: string;

  @Prop()
  email?: string;

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

  @Prop({ default: false })
  phoneNumberVerified?: boolean;

  @Prop({
    type: String,
    enum: ['active', 'pending_setup'],
    default: 'active',
  })
  accountStatus?: 'active' | 'pending_setup';

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

  // Auth-specific fields
  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  @Prop()
  picture?: string;

  @Prop({ default: true })
  isActive?: boolean;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

// Nested schemas for complex types
@Schema({ _id: false })
export class ProgramProgress {
  @Prop()
  currentWeek?: number;

  @Prop()
  completedSessions?: number;

  @Prop()
  lastWorkoutDate?: Date;
}

@Schema({ _id: false })
export class CoachingInfo {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  coachId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'TrainingProgram' }] })
  suggestedPrograms?: Types.ObjectId[];

  // For coaches
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  coachedMembers?: Types.ObjectId[];
}

@Schema({ _id: false })
export class GymAccess {
  @Prop({ default: false })
  canManageSubscriptions: boolean;

  @Prop({ default: false })
  canManageMembers: boolean;

  @Prop({ default: false })
  canManageStaff: boolean;
}

// Main User Schema
@Schema({ timestamps: true })
export class User extends Document {
  declare _id: Types.ObjectId;

  // Embedded profile (not referenced!)
  @Prop({ type: UserProfileSchema, required: true })
  profile: UserProfile;

  @Prop({ type: Types.ObjectId, ref: 'AppSubscriptionModel' })
  appSubscription?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'GymMembership' }], default: [] })
  memberships: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'SubscriptionHistory' }],
    default: [],
  })
  subscriptionHistory: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'AppNotification' }],
    default: [],
  })
  notifications: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'AttendanceRecord' }] })
  attendanceHistory?: Types.ObjectId[];

  @Prop({ enum: Object.values(UserRole), required: true, index: true })
  role: UserRole;

  @Prop({ type: AppSettingsSchema })
  appSettings?: AppSettingsSchema;

  // Member-specific fields
  @Prop({ type: Types.ObjectId, ref: 'TrainingProgram' })
  currentProgram?: Types.ObjectId;

  @Prop({ type: ProgramProgress })
  programProgress?: ProgramProgress;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProgramHistory' }] })
  programHistory?: Types.ObjectId[];

  // Coaching info (for both members and coaches)
  @Prop({ type: CoachingInfo })
  coachingInfo?: CoachingInfo;

  // Coach-specific fields
  @Prop({ type: [String] })
  certifications?: string[];

  // Staff-specific fields
  @Prop({
    type: String,
    enum: STAFF_TYPES,
  })
  staffType?: StaffType;
  @Prop({ type: [String] })
  assignedTasks?: string[];

  // Owner/Manager-specific fields
  @Prop({ type: GymAccess })
  gymAccess?: GymAccess;

  @Prop()
  verificationToken?: string;

  @Prop()
  verificationTokenExpiry?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordTokenExpiry?: Date;

  // OTP fields for phone verification
  @Prop()
  otpCode?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ default: 0 })
  otpAttempts?: number;

  @Prop()
  otpLastSentAt?: Date;

  // Account setup fields for manager-created accounts
  @Prop()
  setupToken?: string;

  @Prop()
  setupTokenExpiry?: Date;

  @Prop({ default: false })
  setupTokenUsed?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { 'profile.email': 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { 'profile.email': { $type: 'string' } },
  },
);
UserSchema.index(
  { 'profile.phoneNumber': 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { 'profile.phoneNumber': { $type: 'string' } },
  },
);
