import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let model: any;

  const mockExercise = {
    _id: 'ex1',
    name: 'Bench Press',
    targetMuscles: ['chest'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    type: 'strength',
    createdBy: 'user1',
    isPublic: true,
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: getModelToken('ExerciseModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
            constructor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    model = module.get(getModelToken('ExerciseModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllExercises', () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockExercise]),
    };

    beforeEach(() => {
      model.find.mockReturnValue(mockQuery);
      model.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
    });

    it('should return paginated public exercises when no filters', async () => {
      const result = await service.findAllExercises({});

      expect(result.data).toEqual([mockExercise]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
      expect(result.totalPages).toBe(1);
      expect(model.find).toHaveBeenCalled();
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(12);
    });

    it('should filter by search term', async () => {
      await service.findAllExercises({ search: 'bench' } as any);
      expect(model.find).toHaveBeenCalled();
    });

    it('should filter by targetMuscle', async () => {
      await service.findAllExercises({ targetMuscle: 'chest' } as any);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findExerciseById', () => {
    it('should return an exercise by id', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExercise),
      });

      const result = await service.findExerciseById('ex1');
      expect(result).toEqual(mockExercise);
    });

    it('should throw NotFoundException when exercise not found', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findExerciseById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateExercise', () => {
    it('should update exercise when user is the creator', async () => {
      const saveMock = jest
        .fn()
        .mockResolvedValue({ ...mockExercise, name: 'Updated' });
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockExercise, save: saveMock }),
      });

      await service.updateExercise('ex1', { name: 'Updated' } as any, 'user1');
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when exercise not found', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateExercise('invalid', {}, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when non-creator tries to edit', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExercise),
      });

      await expect(
        service.updateExercise('ex1', {}, 'otherUser'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteExercise', () => {
    it('should delete exercise when user is the creator', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExercise),
      });
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      await service.deleteExercise('ex1', 'user1');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('ex1');
    });

    it('should throw NotFoundException when exercise not found', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteExercise('invalid', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when non-creator tries to delete', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExercise),
      });

      await expect(service.deleteExercise('ex1', 'otherUser')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
