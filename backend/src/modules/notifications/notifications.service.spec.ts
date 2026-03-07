import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from '../../common/i18n/i18n.service';
import { ExternalNotificationService } from './external-notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationModel: any;

  const mockNotification = {
    _id: 'n1',
    userId: 'user1',
    title: 'Test',
    message: 'Test notification',
    isRead: false,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken('BaseNotification'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            countDocuments: jest.fn(),
            updateMany: jest.fn(),
            deleteMany: jest.fn(),
            discriminators: {},
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            db: {
              model: jest.fn().mockReturnValue({
                findById: jest.fn(),
              }),
            },
          },
        },
        {
          provide: ExternalNotificationService,
          useValue: {
            sendPushNotification: jest.fn().mockResolvedValue(undefined),
            sendEmail: jest.fn().mockResolvedValue(undefined),
            notifyUser: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn().mockImplementation((key: string) => key),
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {
            sendNotification: jest.fn(),
            sendToUser: jest.fn(),
            sendNotificationToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notificationModel = module.get(getModelToken('BaseNotification'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
