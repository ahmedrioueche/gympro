import {
  apiResponse,
  GetNotificationsResponseDto,
} from '@ahmedrioueche/gympro-client';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseNotification } from './notifications.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @InjectModel(BaseNotification.name)
    private readonly notificationModel: Model<BaseNotification>,
  ) {}

  @Get()
  async getMyNotifications(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const userId = req.user.sub;
    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { message: searchRegex }];
    }

    console.log(
      `[NotificationsController] Fetching for user ${userId} with query:`,
      JSON.stringify(query),
    );

    const [data, total] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query).exec(),
    ]);

    // Simple unread count
    const unreadCount = await this.notificationModel.countDocuments({
      userId,
      status: 'unread',
    });

    const response: GetNotificationsResponseDto = {
      data: data as any[],
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      unreadCount,
    };

    return apiResponse(true, undefined, response);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = req.user.sub;
    const count = await this.notificationModel.countDocuments({
      userId,
      status: 'unread',
    });
    return apiResponse(true, undefined, { count });
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    await this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { status: 'read' },
    );
    return apiResponse(true, undefined, { success: true });
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    const userId = req.user.sub;
    await this.notificationModel.updateMany(
      { userId, status: 'unread' },
      { status: 'read' },
    );
    return apiResponse(true, undefined, { success: true });
  }
}
