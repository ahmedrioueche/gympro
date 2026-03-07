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
    it('should return public exercises when no filters', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockExercise]),
      };
      model.find.mockReturnValue(mockQuery);

      const result = await service.findAllExercises({});
      expect(result).toEqual([mockExercise]);
      expect(model.find).toHaveBeenCalled();
    });

    it('should filter by search term', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      model.find.mockReturnValue(mockQuery);

      await service.findAllExercises({ search: 'bench' } as any);
      expect(model.find).toHaveBeenCalled();
    });

    it('should filter by targetMuscle', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockExercise]),
      };
      model.find.mockReturnValue(mockQuery);

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
