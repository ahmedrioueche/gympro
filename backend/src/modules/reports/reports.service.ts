import {
  AlertPriority,
  AlertSource,
  AlertType,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { AddResponseDto } from './dtos/add-response.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportStatusDto } from './dtos/update-report-status.dto';
import { Report, ReportStatus } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    userId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const report = new this.reportModel({
      ...createReportDto,
      reporter: userId,
      status: ReportStatus.OPEN,
    });
    const savedReport = await report.save();

    // Trigger an alert for high priority reports
    this.eventEmitter.emit('alert.create', {
      title: `New Report: ${savedReport.subject}`,
      message: savedReport.description,
      type: AlertType.INFO,
      priority:
        savedReport.priority === 'high'
          ? AlertPriority.HIGH
          : AlertPriority.MEDIUM,
      source: AlertSource.INTERNAL,
      metadata: { reportId: savedReport._id },
    });

    // Notify staff about new report
    this.notificationsService
      .notifyStaff({
        title: `New Report: ${savedReport.subject}`,
        message: savedReport.description.substring(0, 100),
        type: 'alert',
        priority: 'medium',
        relatedId: String(savedReport._id),
      })
      .catch((err) =>
        console.error('Failed to notify staff about report:', err),
      );

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel
      .find()
      .populate('reporter', 'profile')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel
      .findById(id)
      .populate('reporter', 'profile')
      .exec();
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async findByReporter(userId: string): Promise<Report[]> {
    return this.reportModel
      .find({ reporter: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(
    id: string,
    updateReportStatusDto: UpdateReportStatusDto,
  ): Promise<Report> {
    const report = await this.reportModel
      .findByIdAndUpdate(
        id,
        { status: updateReportStatusDto.status },
        { new: true },
      )
      .populate('reporter', 'profile appSettings')
      .populate('responses.sender', 'profile')
      .exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Trigger alert for status change
    this.eventEmitter.emit('alert.create', {
      title: `Report Updated: ${report.subject}`,
      message: `Status changed to ${updateReportStatusDto.status}`,
      type: AlertType.INFO,
      priority: AlertPriority.MEDIUM,
      source: AlertSource.INTERNAL,
      metadata: { reportId: report._id },
    });

    // Get reporter ID for notifications
    const reporterId =
      typeof report.reporter === 'string'
        ? report.reporter
        : (report.reporter as any)?._id?.toString();

    // Notify the reporter about status change
    if (reporterId) {
      this.notifyUserById(reporterId, {
        title: `Report Status Updated`,
        message: `Your report "${report.subject}" status changed to ${updateReportStatusDto.status}`,
        type: 'alert',
        priority: 'medium',
        relatedId: String(report._id),
      });
    }

    // Notify staff about status change
    this.notificationsService
      .notifyStaff({
        title: `Report Status Updated`,
        message: `Report "${report.subject}" status changed to ${updateReportStatusDto.status}`,
        type: 'alert',
        priority: 'low',
        relatedId: String(report._id),
      })
      .catch((err) => console.error('Failed to notify staff:', err));

    return report;
  }

  async addResponse(
    id: string,
    userId: string,
    addResponseDto: AddResponseDto,
  ): Promise<Report> {
    const report = await this.reportModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            responses: {
              sender: userId,
              message: addResponseDto.message,
              attachments: addResponseDto.attachments || [],
              createdAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .populate('reporter', 'profile appSettings')
      .populate('responses.sender', 'profile appSettings')
      .exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Trigger alert for new response
    this.eventEmitter.emit('alert.create', {
      title: `New Response on Report: ${report.subject}`,
      message: addResponseDto.message.substring(0, 100),
      type: AlertType.INFO,
      priority: AlertPriority.MEDIUM,
      source: AlertSource.INTERNAL,
      metadata: { reportId: report._id },
    });

    // Determine who to notify
    const reporterId =
      typeof report.reporter === 'string'
        ? report.reporter
        : (report.reporter as any)?._id?.toString();
    const isUserReporter = userId === reporterId;

    if (isUserReporter) {
      // User replied - notify staff only
      this.notificationsService
        .notifyStaff({
          title: `New Reply on Report`,
          message: `User replied to "${report.subject}": ${addResponseDto.message.substring(0, 80)}`,
          type: 'alert',
          priority: 'medium',
          relatedId: String(report._id),
        })
        .catch((err) => console.error('Failed to notify staff:', err));
    } else {
      // Admin/Staff replied - notify the reporter only
      if (reporterId) {
        this.notifyUserById(reporterId, {
          title: `New Reply on Your Report`,
          message: `You have a new reply on "${report.subject}"`,
          type: 'alert',
          priority: 'medium',
          relatedId: String(report._id),
        });
      }
    }

    return report;
  }

  /**
   * Helper to fetch user and send notification
   */
  private async notifyUserById(
    userId: string,
    options: {
      title: string;
      message: string;
      type: 'alert';
      priority: 'low' | 'medium' | 'high';
      relatedId: string;
    },
  ): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (user) {
        await this.notificationsService.notifyUser(user, options);
      }
    } catch (err) {
      console.error('Failed to notify user:', err);
    }
  }

  async addAttachments(
    id: string,
    userId: string,
    attachments: string[],
  ): Promise<Report> {
    const report = await this.reportModel.findById(id);

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Check if user is the reporter
    const reporterId = report.reporter.toString();
    if (reporterId !== userId) {
      throw new NotFoundException('Only the reporter can add attachments');
    }

    // Add new attachments
    report.attachments = [...(report.attachments || []), ...attachments];
    await report.save();

    return this.findOne(id);
  }
}
