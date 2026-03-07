import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('AppSubscriptionModel'),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken('AppPlanModel'),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken('AppPaymentModel'),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: { find: jest.fn(), findByIdAndUpdate: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
