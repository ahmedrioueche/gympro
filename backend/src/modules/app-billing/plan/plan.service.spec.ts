import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppPlanModel } from '../appBilling.schema';
import { AppPlansService } from './plan.service';

describe('AppPlansService', () => {
  let service: AppPlansService;
  let model: any;

  const mockPlan = {
    _id: 'plan1',
    planId: 'pro',
    name: 'Pro',
    level: 'pro',
    version: 1,
    pricing: { USD: { monthly: 10, yearly: 100 } },
    isActive: true,
    save: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppPlansService,
        {
          provide: getModelToken(AppPlanModel.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppPlansService>(AppPlansService);
    model = module.get(getModelToken(AppPlanModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPlans', () => {
    it('should return active plans', async () => {
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPlan]),
      });

      const result = await service.getAllPlans();
      expect(result).toHaveLength(1);
    });

    it('should include inactive plans when requested', async () => {
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPlan]),
      });

      await service.getAllPlans(true);
      expect(model.find).toHaveBeenCalledWith({});
    });
  });

  describe('getPlanById', () => {
    it('should return plan by id', async () => {
      model.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlan),
      });

      const result = await service.getPlanById('plan1');
      expect(result).toEqual(mockPlan);
    });

    it('should throw NotFoundException when plan not found', async () => {
      model.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getPlanById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPlanByPlanId', () => {
    it('should return plan by planId', async () => {
      model.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlan),
      });

      const result = await service.getPlanByPlanId('pro');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when plan not found', async () => {
      model.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getPlanByPlanId('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('planExists', () => {
    it('should return true when plan exists', async () => {
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.planExists('plan1');
      expect(result).toBe(true);
    });

    it('should return false when plan does not exist', async () => {
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.planExists('invalid');
      expect(result).toBe(false);
    });
  });

  describe('deletePlan', () => {
    it('should delete plan', async () => {
      model.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlan),
      });
      mockPlan.deleteOne.mockResolvedValue(true);

      const result = await service.deletePlan('plan1');
      expect(result.message).toBe('Plan deleted successfully');
    });
  });
});
