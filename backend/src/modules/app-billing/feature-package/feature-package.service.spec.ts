import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppFeaturePackageModel } from './feature-package.schema';
import { AppFeaturePackageService } from './feature-package.service';

describe('AppFeaturePackageService', () => {
  let service: AppFeaturePackageService;
  let model: any;

  const mockPackage = { _id: 'fp1', name: 'Analytics Pack', isActive: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppFeaturePackageService,
        {
          provide: getModelToken(AppFeaturePackageModel.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppFeaturePackageService>(AppFeaturePackageService);
    model = module.get(getModelToken(AppFeaturePackageModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a feature package', async () => {
      model.create.mockResolvedValue(mockPackage);
      const result = await service.create({ name: 'Analytics Pack' } as any);
      expect(result).toEqual(mockPackage);
    });
  });

  describe('findAll', () => {
    it('should return all packages', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPackage]),
      });
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });

    it('should filter active only', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPackage]),
      });
      await service.findAll(true);
      expect(model.find).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('findOne', () => {
    it('should return a package by id', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackage),
      });
      const result = await service.findOne('fp1');
      expect(result).toEqual(mockPackage);
    });
  });

  describe('update', () => {
    it('should update a package', async () => {
      const updated = { ...mockPackage, name: 'Updated' };
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });
      const result = await service.update('fp1', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete a package', async () => {
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackage),
      });
      const result = await service.delete('fp1');
      expect(result).toEqual(mockPackage);
    });
  });
});
