import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let model: any;

  const mockProduct = {
    _id: 'prod1',
    name: 'Protein Shake',
    gymId: 'gym1',
    category: 'supplements',
    status: 'active',
    createdBy: 'user1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getModelToken('ProductModel'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    model = module.get(getModelToken('ProductModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      model.countDocuments.mockResolvedValue(1);
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      });

      const result = await service.findAll('gym1', { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a product by id and gymId', async () => {
      model.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.findOne('gym1', 'prod1');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when not found', async () => {
      model.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('gym1', 'invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updated = { ...mockProduct, name: 'Updated' };
      model.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update(
        'gym1',
        'prod1',
        { name: 'Updated' } as any,
        'user1',
      );
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException when product not found', async () => {
      model.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('gym1', 'invalid', {} as any, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      model.deleteOne.mockResolvedValue({ deletedCount: 1 });
      await expect(service.remove('gym1', 'prod1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when product not found', async () => {
      model.deleteOne.mockResolvedValue({ deletedCount: 0 });
      await expect(service.remove('gym1', 'invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
