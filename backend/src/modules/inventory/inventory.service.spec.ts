import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let model: any;

  const mockItem = {
    _id: 'item1',
    name: 'Dumbbells',
    gymId: 'gym1',
    category: 'equipment',
    quantity: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getModelToken('EquipmentItemModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    model = module.get(getModelToken('EquipmentItemModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated inventory items', async () => {
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockItem]),
      });

      const result = await service.findAll('gym1');
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an inventory item', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItem),
      });

      const result = await service.findOne('item1');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when not found', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an inventory item', async () => {
      const updated = { ...mockItem, name: 'Updated' };
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update(
        'item1',
        { name: 'Updated' } as any,
        'user1',
      );
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove an inventory item', async () => {
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItem),
      });
      const result = await service.remove('item1');
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException when item not found', async () => {
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
