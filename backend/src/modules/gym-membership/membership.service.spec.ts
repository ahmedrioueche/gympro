import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { MembershipService } from './membership.service';

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getModelToken('User'),
          useValue: { find: jest.fn(), findById: jest.fn() },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: { find: jest.fn(), findById: jest.fn() },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: getModelToken('SubscriptionHistory'),
          useValue: { find: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
