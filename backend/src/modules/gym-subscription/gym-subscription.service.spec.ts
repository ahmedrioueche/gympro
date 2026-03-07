import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GymSubscriptionService } from './gymSubscription.service';

describe('GymSubscriptionService', () => {
  let service: GymSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymSubscriptionService,
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GymSubscriptionService>(GymSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
