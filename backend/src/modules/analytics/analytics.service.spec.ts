import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let gymModel: any;
  let membershipModel: any;
  let paymentModel: any;
  let historyModel: any;
  let affiliationModel: any;
  let sessionModel: any;

  const validGymId = new Types.ObjectId().toHexString();

  const createMockQuery = (result: any) => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
    then: jest.fn().mockImplementation((resolve: any) => resolve(result)),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  });

  const createMockAggregate = (result: any) => ({
    exec: jest.fn().mockResolvedValue(result),
    then: jest.fn().mockImplementation((resolve: any) => resolve(result)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken('GymModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('AppPaymentModel'),
          useValue: {
            find: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('SubscriptionHistory'),
          useValue: {
            find: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymCoachAffiliation'),
          useValue: {
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('Session'),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            countDocuments: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    gymModel = module.get(getModelToken('GymModel'));
    membershipModel = module.get(getModelToken('GymMembership'));
    paymentModel = module.get(getModelToken('AppPaymentModel'));
    historyModel = module.get(getModelToken('SubscriptionHistory'));
    affiliationModel = module.get(getModelToken('GymCoachAffiliation'));
    sessionModel = module.get(getModelToken('Session'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGymStats', () => {
    it('should return gym-specific analytics', async () => {
      gymModel.findById.mockReturnValue(
        createMockQuery({ _id: validGymId, name: 'Test Gym' }),
      );
      membershipModel.countDocuments.mockImplementation(() =>
        createMockQuery(20),
      );
      membershipModel.aggregate.mockImplementation(() =>
        createMockAggregate([]),
      );
      historyModel.aggregate.mockImplementation(() => createMockAggregate([]));
      sessionModel.countDocuments.mockImplementation(() => createMockQuery(10));
      sessionModel.aggregate.mockImplementation(() => createMockAggregate([]));
      affiliationModel.countDocuments.mockImplementation(() =>
        createMockQuery(2),
      );

      const result = await service.getGymStats(validGymId);
      expect(result).toBeDefined();
    });
  });
});
