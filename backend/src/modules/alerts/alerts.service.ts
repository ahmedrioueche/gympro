import {
  AlertPriority,
  AlertStatus,
  APP_PERMISSIONS,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '../../common/services/mailer.service';
import { UsersService } from '../users/users.service';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { Alert, AlertDocument } from './schemas/alert.schema';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = new this.alertModel({
      ...createAlertDto,
      status: AlertStatus.UNREAD,
    });

    const savedAlert = await alert.save();

    // Trigger notifications for High/Critical alerts
    if (
      savedAlert.priority === AlertPriority.HIGH ||
      savedAlert.priority === AlertPriority.CRITICAL
    ) {
      await this.notifyStaff(savedAlert);
    }

    return savedAlert;
  }

  async findAll(): Promise<Alert[]> {
    return this.alertModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Alert> {
    const alert = await this.alertModel.findById(id).exec();
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return alert;
  }

  async updateStatus(id: string, status: AlertStatus): Promise<Alert> {
    const alert = await this.alertModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  private async notifyStaff(alert: AlertDocument) {
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
      const recipients = new Set<string>();

      if (adminEmail) {
        recipients.add(adminEmail);
      }

      // Find all editors with manage_alerts permission
      // This is a conceptual implementation, assuming UsersService has a way to filter by permission
      // If not, we might need to fetch all admins/editors and check their permissions
      const staffWithPermission = await this.usersService.findStaffByPermission(
        APP_PERMISSIONS.MANAGE_ALERTS,
      );

      staffWithPermission.forEach((user) => {
        if (user.profile.email) {
          recipients.add(user.profile.email);
        }
      });

      if (recipients.size === 0) {
        this.logger.warn('No recipients found for priority alert notification');
        return;
      }

      const subject = `[${alert.priority.toUpperCase()}] ${alert.title}`;
      const html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #ef4444;">System Alert: ${alert.title}</h2>
          <p><strong>Priority:</strong> ${alert.priority}</p>
          <p><strong>Type:</strong> ${alert.type}</p>
          <p><strong>Source:</strong> ${alert.source}</p>
          <hr />
          <p>${alert.message}</p>
          ${alert.stackTrace ? `<pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">${alert.stackTrace}</pre>` : ''}
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated notification from GymPro Admin System.</p>
        </div>
      `;

      await Promise.all(
        Array.from(recipients).map((email) =>
          this.mailerService.sendMail(email, subject, html),
        ),
      );
    } catch (error) {
      this.logger.error('Failed to send alert notifications:', error);
    }
  }
}
