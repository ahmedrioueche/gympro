import {
  AlertPriority,
  AlertSource,
  AlertType,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportStatusDto } from './dtos/update-report-status.dto';
import { Report, ReportStatus } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private readonly eventEmitter: EventEmitter2,
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

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel
      .find()
      .populate('reporter', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel
      .findById(id)
      .populate('reporter', 'firstName lastName email avatar')
      .exec();
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
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
      .populate('reporter', 'firstName lastName email avatar')
      .exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }
}
