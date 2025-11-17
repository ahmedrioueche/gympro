import type {
  Gym,
  GymMembership,
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

@Schema({ timestamps: true })
export class GymMembershipModel extends Document implements GymMembership {
  declare _id: string;

  @Prop({ type: Types.ObjectId, ref: 'GymModel', required: true })
  gym: Gym;

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

  @Prop() createdAt: Date;
  @Prop() updatedAt?: Date;
  @Prop() createdBy?: string;
  @Prop() updatedBy?: string;
}

export const GymMembershipSchema =
  SchemaFactory.createForClass(GymMembershipModel);
