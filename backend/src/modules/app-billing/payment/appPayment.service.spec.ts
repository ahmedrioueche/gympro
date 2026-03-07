import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppPlanModel } from '../appBilling.schema';
import { AppPaymentModel } from './appPayment.schema';
import { AppPaymentService } from './appPayment.service';

describe('AppPaymentService', () => {
  let service: AppPaymentService;
  let paymentModel: any;
  let planModel: any;

  const mockPayment = {
    _id: 'pay1',
    userId: 'user1',
    planId: 'pro',
    amount: 10,
    currency: 'USD',
    status: 'completed',
    provider: 'paddle',
    providerTransactionId: 'txn1',
    createdAt: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppPaymentService,
        {
          provide: getModelToken(AppPaymentModel.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken(AppPlanModel.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppPaymentService>(AppPaymentService);
    paymentModel = module.get(getModelToken(AppPaymentModel.name));
    planModel = module.get(getModelToken(AppPlanModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentById', () => {
    it('should return payment with plan data', async () => {
      paymentModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPayment),
      });
      planModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: 'p1',
          planId: 'pro',
          name: 'Pro',
          level: 'pro',
        }),
      });

      const result = await service.getPaymentById('pay1', 'user1');
      expect(result).toBeDefined();
    });

    it('should return null when payment not found', async () => {
      paymentModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getPaymentById('invalid', 'user1');
      expect(result).toBeNull();
    });
  });

  describe('getUserPayments', () => {
    it('should return paginated payments', async () => {
      paymentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPayment]),
      });
      paymentModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      planModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getUserPayments('user1');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const updated = { ...mockPayment, status: 'refunded' };
      paymentModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.updatePaymentStatus(
        'pay1',
        'refunded' as any,
      );
      expect(result).toBeDefined();
    });

    it('should return null when payment not found', async () => {
      paymentModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.updatePaymentStatus(
        'invalid',
        'completed' as any,
      );
      expect(result).toBeNull();
    });
  });

  describe('getPaymentStats', () => {
    it('should return payment statistics', async () => {
      paymentModel.find.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          {
            ...mockPayment,
            amount: 10,
            status: 'completed',
            provider: 'paddle',
          },
          {
            ...mockPayment,
            amount: 20,
            status: 'completed',
            provider: 'chargily',
          },
        ]),
      });

      const result = await service.getPaymentStats('user1');
      expect(result.totalPayments).toBe(2);
      expect(result.totalRevenue).toBe(30);
      expect(result.revenueByProvider.paddle).toBe(10);
      expect(result.revenueByProvider.chargily).toBe(20);
    });

    it('should handle no payments', async () => {
      paymentModel.find.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getPaymentStats('user1');
      expect(result.totalPayments).toBe(0);
      expect(result.successRate).toBe(0);
    });
  });
});
