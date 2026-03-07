import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberAnalyticsService } from './member-analytics.service';

describe('MemberAnalyticsService', () => {
  let service: MemberAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberAnalyticsService,
        {
          provide: getModelToken('SubscriptionHistory'),
          useValue: {
            find: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('Session'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemberAnalyticsService>(MemberAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
