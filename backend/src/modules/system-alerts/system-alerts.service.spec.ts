import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionBlockerService } from '../app-billing/subscription/subscription-blocker.service';
import { SystemAlertsService } from './system-alerts.service';

describe('SystemAlertsService', () => {
  let service: SystemAlertsService;
  let model: any;
  let blockerService: any;

  const mockAlert = {
    _id: 'sa1',
    translations: { en: 'Maintenance' },
    variant: 'info',
    isActive: true,
    templateKey: 'GENERAL',
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
  };

  const createMockQuery = (result: any) => ({
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
    then: jest.fn().mockImplementation((resolve: any) => resolve(result)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemAlertsService,
        {
          provide: getModelToken('SystemAlert'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: SubscriptionBlockerService,
          useValue: {
            getBlockerConfig: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<SystemAlertsService>(SystemAlertsService);
    model = module.get(getModelToken('SystemAlert'));
    blockerService = module.get(SubscriptionBlockerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all system alerts', async () => {
      model.find.mockReturnValue(createMockQuery([mockAlert]));

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findActive', () => {
    it('should return active alerts without subscription warning for anonymous', async () => {
      model.find.mockReturnValue(createMockQuery([mockAlert]));

      const result = await service.findActive();
      expect(result).toHaveLength(1);
    });

    it('should check blocker config when userId is provided', async () => {
      model.find.mockReturnValue(createMockQuery([mockAlert]));

      await service.findActive('user1');
      expect(blockerService.getBlockerConfig).toHaveBeenCalledWith('user1');
    });
  });

  describe('findOne', () => {
    it('should return alert by id', async () => {
      model.findById.mockReturnValue(createMockQuery(mockAlert));

      const result = await service.findOne('sa1');
      expect(result).toEqual(mockAlert);
    });

    it('should throw NotFoundException when not found', async () => {
      model.findById.mockReturnValue(createMockQuery(null));

      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a system alert', async () => {
      const updated = { ...mockAlert, translations: { en: 'Updated' } };
      model.findByIdAndUpdate.mockReturnValue(createMockQuery(updated));

      const result = await service.update('sa1', {
        translations: { en: 'Updated' },
      } as any);
      expect(result.translations.en).toBe('Updated');
    });

    it('should throw NotFoundException when not found', async () => {
      model.findByIdAndUpdate.mockReturnValue(createMockQuery(null));

      await expect(service.update('invalid', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a system alert', async () => {
      model.findByIdAndDelete.mockReturnValue(createMockQuery(mockAlert));

      const result = await service.remove('sa1');
      expect(result).toEqual(mockAlert);
    });

    it('should throw NotFoundException when not found', async () => {
      model.findByIdAndDelete.mockReturnValue(createMockQuery(null));

      await expect(service.remove('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
