import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '../../common/services/mailer.service';
import { UsersService } from '../users/users.service';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let alertModel: any;

  const mockAlert = {
    _id: 'alert1',
    title: 'Test Alert',
    message: 'Test message',
    priority: 'low',
    type: 'system',
    source: 'test',
    status: 'unread',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: getModelToken('Alert'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('admin@example.com') },
        },
        {
          provide: UsersService,
          useValue: { findStaffByPermission: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    alertModel = module.get(getModelToken('Alert'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all alerts sorted by createdAt', async () => {
      alertModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockAlert]),
      });

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return an alert by id', async () => {
      alertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAlert),
      });

      const result = await service.findOne('alert1');
      expect(result).toEqual(mockAlert);
    });

    it('should throw NotFoundException when not found', async () => {
      alertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update alert status', async () => {
      const updated = { ...mockAlert, status: 'read' };
      alertModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.updateStatus('alert1', 'read' as any);
      expect(result.status).toBe('read');
    });

    it('should throw NotFoundException when not found', async () => {
      alertModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateStatus('invalid', 'read' as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
