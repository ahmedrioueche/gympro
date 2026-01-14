import type {
  MembershipStatus,
  RolePermissions,
  SubscriptionInfo,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubscriptionInfoSchema } from '../gymSubscription/gymSubscription.schema';

@Schema({ _id: false })
export class CustomPermissionsModel implements Partial<RolePermissions> {
  @Prop() canManageMembers?: boolean;
  @Prop() canManageSubscriptions?: boolean;
  @Prop() canManageStaff?: boolean;
  @Prop() canViewFinancials?: boolean;
  @Prop() canAssignPrograms?: boolean;
  @Prop() canManageAppSubscriptions?: boolean;
  @Prop() canCustomizePermissions?: boolean;
}

@Schema({ _id: false })
export class GeneralSettingsModel {
  @Prop({ enum: ['kg', 'lbs'], default: 'kg' }) weightUnit: 'kg' | 'lbs';
}

@Schema({ _id: false })
export class NotificationSettingsModel {
  @Prop({ default: true }) classReminders: boolean;
  @Prop({ default: true }) subscriptionRenewal: boolean;
  @Prop({ default: true }) announcements: boolean;
}

@Schema({ _id: false })
export class PrivacySettingsModel {
  @Prop({ default: true }) publicProfile: boolean;
  @Prop({ default: true }) shareProgressWithCoaches: boolean;
}

@Schema({ _id: false })
export class MembershipSettingsModel {
  @Prop({ type: GeneralSettingsModel, default: () => ({}) })
  general: GeneralSettingsModel;

  @Prop({ type: NotificationSettingsModel, default: () => ({}) })
  notifications: NotificationSettingsModel;

  @Prop({ type: PrivacySettingsModel, default: () => ({}) })
  privacy: PrivacySettingsModel;
}

@Schema({ timestamps: true, collection: 'gym_memberships' })
export class GymMembershipModel extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true })
  gym: Types.ObjectId;

  @Prop({ type: [String], required: true })
  roles: UserRole[];

  @Prop({ required: true })
  joinedAt: string;

  @Prop({
    type: String,
    enum: ['active', 'pending', 'banned', 'canceled', 'expired'],
    required: true,
  })
  membershipStatus: MembershipStatus;

  @Prop({ type: SubscriptionInfoSchema })
  subscription?: SubscriptionInfo;

  @Prop({ type: CustomPermissionsModel })
  customPermissions?: Partial<RolePermissions>;

  // New granular permissions system (e.g., ['members:view', 'attendance:checkin'])
  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: MembershipSettingsModel, default: () => ({}) })
  settings: MembershipSettingsModel;

  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
  @Prop() createdBy?: string;
  @Prop() updatedBy?: string;
}

export const GymMembershipSchema =
  SchemaFactory.createForClass(GymMembershipModel);
