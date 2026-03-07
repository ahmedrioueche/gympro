import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionBlockerService } from './subscription-blocker.service';

describe('SubscriptionBlockerService', () => {
  let service: SubscriptionBlockerService;
  let subscriptionModel: any;

  const mockActiveSub = {
    _id: 'sub1',
    userId: 'user1',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    billingCycle: 'monthly',
    planId: 'pro',
  };

  const mockExpiredSub = {
    _id: 'sub2',
    userId: 'user2',
    status: 'expired',
    currentPeriodEnd: new Date(Date.now() - 24 * 60 * 60 * 1000),
    billingCycle: 'monthly',
    planId: 'pro',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionBlockerService,
        {
          provide: getModelToken('AppSubscriptionModel'),
          useValue: {
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionBlockerService>(
      SubscriptionBlockerService,
    );
    subscriptionModel = module.get(getModelToken('AppSubscriptionModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBlockerConfig', () => {
    it('should return null for active subscription far from expiry', async () => {
      subscriptionModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockActiveSub),
      });

      const result = await service.getBlockerConfig('user1');
      expect(result).toBeNull();
    });

    it('should return null when no subscription found', async () => {
      subscriptionModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getBlockerConfig('user1');
      expect(result).toBeNull();
    });
  });

  describe('getGracePhase', () => {
    it('should return a phase string for any subscription', () => {
      const result = service.getGracePhase(mockActiveSub as any);
      expect(typeof result).toBe('string');
    });
  });

  describe('resetSoftGrace', () => {
    it('should call findByIdAndUpdate', async () => {
      subscriptionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      await service.resetSoftGrace('sub1');
      expect(subscriptionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'sub1',
        expect.objectContaining({ $unset: expect.any(Object) }),
      );
    });
  });
});
