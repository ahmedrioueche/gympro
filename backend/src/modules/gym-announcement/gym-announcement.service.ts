import {
  NotificationPriority,
  NotificationType,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MembershipService } from '../gym-membership/membership.service';
import { GymModel } from '../gym/gym.schema';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateGymAnnouncementDto,
  UpdateGymAnnouncementDto,
} from './dto/create-announcement.dto';
import {
  GymAnnouncementDocument,
  GymAnnouncementModel,
} from './schemas/gym-announcement.schema';

@Injectable()
export class GymAnnouncementService {
  private readonly logger = new Logger(GymAnnouncementService.name);

  constructor(
    @InjectModel(GymAnnouncementModel.name)
    private announcementModel: Model<GymAnnouncementDocument>,
    @InjectModel('GymModel') private gymModel: Model<GymModel>,
    private readonly membershipService: MembershipService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    createDto: CreateGymAnnouncementDto,
    authorId: string,
    authorName: string,
  ) {
    const announcement = new this.announcementModel({
      ...createDto,
      gymId: new Types.ObjectId(createDto.gymId),
      author: {
        _id: new Types.ObjectId(authorId),
        name: authorName,
      },
    });
    const saved = await announcement.save();

    // Async notification dispatch
    this.sendNotifications(saved, createDto.gymId).catch((err) => {
      this.logger.error(
        `Failed to send announcement notifications: ${err.message}`,
        err.stack,
      );
    });

    return saved;
  }

  private async sendNotifications(announcement: any, gymId: string) {
    const gym = await this.gymModel.findById(gymId).select('name').lean();
    const gymName = gym?.name || 'Gym';

    const targetUsers = new Map<string, any>();

    // 1. Fetch Target Users
    if (
      announcement.targetAudience === 'members' ||
      announcement.targetAudience === 'all'
    ) {
      const members = await this.membershipService.findAllActiveMembers(gymId);
      members.forEach((u) => targetUsers.set(u._id.toString(), u));
    }

    if (
      announcement.targetAudience === 'staff' ||
      announcement.targetAudience === 'all'
    ) {
      const staff = await this.membershipService.findAllStaff(gymId);
      staff.forEach((u) => targetUsers.set(u._id.toString(), u));
    }

    if (targetUsers.size === 0) return;

    // 2. Map Priority
    let priority: NotificationPriority = 'low';
    if (announcement.priority === 'critical') priority = 'high';
    else if (announcement.priority === 'high') priority = 'medium';

    // 3. Prepare Notification Options
    const truncatedContent =
      announcement.content.length > 100
        ? announcement.content.substring(0, 97) + '...'
        : announcement.content;

    this.logger.log(
      `Dispatching announcement ${announcement._id} to ${targetUsers.size} users. Audience: ${announcement.targetAudience}`,
    );

    // 4. Send
    const promises = Array.from(targetUsers.values()).map((user) =>
      this.notificationsService.notifyUser(user, {
        title: announcement.title, // Use direct title/message since it's user-generated content
        message: truncatedContent,
        type: 'announcement' as NotificationType,
        priority,
        gymId, // Add gymId for gym-specific filtering
        relatedId: announcement._id.toString(),
        action: {
          type: 'link',
          payload: `/gym/member/announcements`,
          label: 'View Announcements',
        },
        key: 'gym_announcement', // Fallback key for standard "New Announcement" text if needed, but we pass explicit title
        vars: {
          title: announcement.title,
          message: truncatedContent,
          gymName: gymName,
        },
      }),
    );

    await Promise.allSettled(promises);
  }

  async findAll(gymId: string, page = 1, limit = 20, isActive?: boolean) {
    const filter: any = { gymId: new Types.ObjectId(gymId) };
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.announcementModel
        .find(filter)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .exec(),
      this.announcementModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const announcement = await this.announcementModel.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  async update(id: string, updateDto: UpdateGymAnnouncementDto) {
    const announcement = await this.announcementModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    );
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  async remove(id: string) {
    const announcement = await this.announcementModel.findByIdAndDelete(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }
}
