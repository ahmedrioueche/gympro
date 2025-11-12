import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { RolePermissions } from '@client/types/role';

@Schema({})
export class RolePermissionsModel extends Document implements RolePermissions {
  @Prop() canManageMembers?: boolean;
  @Prop() canManageSubscriptions?: boolean;
  @Prop() canManageStaff?: boolean;
  @Prop() canViewFinancials?: boolean;
  @Prop() canAssignPrograms?: boolean;
  @Prop() canManageAppSubscriptions?: boolean;
  @Prop() canCustomizePermissions?: boolean;
}
export const RolePermissionsSchema =
  SchemaFactory.createForClass(RolePermissionsModel);
