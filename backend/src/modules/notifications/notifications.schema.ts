import type {
  BaseNotification as ClientBaseNotification,
  CoachNotification as ClientCoachNotification,
  MemberNotification as ClientMemberNotification,
  OwnerManagerNotification as ClientOwnerManagerNotification,
  StaffNotification as ClientStaffNotification,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, discriminatorKey: 'roleType' })
export class BaseNotification
  extends Document
  implements ClientBaseNotification
{
  @Prop() declare _id: string;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) message: string;
  @Prop({ required: true }) createdAt: string;
  @Prop({ required: true, enum: ['unread', 'read', 'archived'] })
  status: NotificationStatus;
  @Prop({ enum: ['low', 'medium', 'high'] }) priority?: NotificationPriority;
  @Prop({
    required: true,
    enum: [
      'subscription',
      'payment',
      'program',
      'reminder',
      'alert',
      'announcement',
    ],
  })
  type: NotificationType;
}
export const BaseNotificationSchema =
  SchemaFactory.createForClass(BaseNotification);

@Schema()
export class MemberNotification
  extends BaseNotification
  implements ClientMemberNotification
{
  @Prop({
    required: true,
    enum: ['subscription', 'program', 'reminder', 'alert'],
  })
  declare type: 'subscription' | 'program' | 'reminder' | 'alert';
  @Prop() relatedProgramId?: string;
  @Prop() relatedCoachId?: string;
}
@Schema()
export class CoachNotification
  extends BaseNotification
  implements ClientCoachNotification
{
  @Prop({
    required: true,
    enum: ['program', 'reminder', 'alert', 'announcement'],
  })
  declare type: 'program' | 'reminder' | 'alert' | 'announcement';
  @Prop({ type: [String] }) relatedMemberIds?: string[];
}
@Schema()
export class StaffNotification
  extends BaseNotification
  implements ClientStaffNotification
{
  @Prop({ required: true, enum: ['reminder', 'alert', 'announcement'] })
  declare type: 'reminder' | 'alert' | 'announcement';
  @Prop() relatedTaskId?: string;
}
@Schema()
export class OwnerManagerNotification
  extends BaseNotification
  implements ClientOwnerManagerNotification
{
  @Prop({
    required: true,
    enum: ['subscription', 'payment', 'reminder', 'alert', 'announcement'],
  })
  declare type:
    | 'subscription'
    | 'payment'
    | 'reminder'
    | 'alert'
    | 'announcement';
  @Prop() relatedGymId?: string;
}
export const MemberNotificationSchema =
  SchemaFactory.createForClass(MemberNotification);
export const CoachNotificationSchema =
  SchemaFactory.createForClass(CoachNotification);
export const StaffNotificationSchema =
  SchemaFactory.createForClass(StaffNotification);
export const OwnerManagerNotificationSchema = SchemaFactory.createForClass(
  OwnerManagerNotification,
);
