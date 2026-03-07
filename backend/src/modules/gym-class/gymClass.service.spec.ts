import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from '../gym-membership/membership.service';
import { GymService } from '../gym/gym.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GymClassService } from './gymClass.service';

describe('GymClassService', () => {
  let service: GymClassService;
  let gymClassModel: any;

  const mockClass = {
    _id: 'class1',
    gymId: 'gym1',
    name: 'Yoga',
    status: 'active',
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymClassService,
        {
          provide: getModelToken('GymClassModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: getModelToken('SessionModel'),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: MembershipService,
          useValue: { findMembership: jest.fn() },
        },
        {
          provide: GymService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GymClassService>(GymClassService);
    gymClassModel = module.get(getModelToken('GymClassModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
