import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppSubscriptionService } from '../app-billing/subscription/subscription.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GymService } from './gym.service';

describe('GymService', () => {
  let service: GymService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymService,
        {
          provide: getModelToken('GymModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            countDocuments: jest.fn(),
            findOneAndUpdate: jest.fn(),
            aggregate: jest.fn(),
            distinct: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: {
            find: jest.fn(),
            aggregate: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymCoachAffiliation'),
          useValue: { find: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyUser: jest.fn(),
            notifyStaff: jest.fn(),
            notifyScheduleChange: jest.fn(),
            notifyGymClosureChange: jest.fn(),
          },
        },
        {
          provide: AppSubscriptionService,
          useValue: { getMySubscription: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GymService>(GymService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
