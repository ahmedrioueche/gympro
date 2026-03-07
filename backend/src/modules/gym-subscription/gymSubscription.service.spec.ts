import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { GymSubscriptionService } from './gymSubscription.service';

describe('GymSubscriptionService', () => {
  let service: GymSubscriptionService;
  let model: any;

  // Use valid 24-char ObjectId hex strings
  const gymId = new Types.ObjectId().toHexString();
  const subId = new Types.ObjectId().toHexString();

  const mockSubType = {
    _id: subId,
    gymId: gymId,
    name: 'Monthly',
    price: 50,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymSubscriptionService,
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: {
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GymSubscriptionService>(GymSubscriptionService);
    model = module.get(getModelToken('SubscriptionTypeModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSubscriptionTypes', () => {
    it('should return subscription types for a gym', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockSubType]),
      });

      const result = await service.getSubscriptionTypes(gymId);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('updateSubscriptionType', () => {
    it('should update a subscription type', async () => {
      const updated = { ...mockSubType, name: 'Updated' };
      model.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.updateSubscriptionType(gymId, subId, {
        name: 'Updated',
      } as any);
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(
        service.updateSubscriptionType(gymId, 'invalid-id', {} as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteSubscriptionType', () => {
    it('should delete a subscription type', async () => {
      model.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSubType),
      });

      const result = await service.deleteSubscriptionType(gymId, subId);
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(
        service.deleteSubscriptionType(gymId, 'invalid-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
