import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppSubscriptionService } from '../app-billing/subscription/subscription.service';
import { GymService } from '../gym/gym.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const getMockUser = () => ({
    _id: 'user1',
    email: 'test@example.com',
    profile: {
      fullName: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      isActive: true,
    },
    role: 'member',
    isActive: true,
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
  });

  const createMockQuery = (result: any) => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
    then: jest.fn().mockImplementation((resolve) => resolve(result)),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('AppPlanModel'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AppSubscriptionService,
          useValue: {
            getMySubscription: jest.fn().mockResolvedValue(null),
            subscribe: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: GymService,
          useValue: {
            findByUserId: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyUser: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      userModel.findById.mockReturnValue(createMockQuery(getMockUser()));

      const result = await service.findById('user1');
      expect(result._id).toBe('user1');
    });

    it('should throw NotFoundException when user not found', async () => {
      userModel.findById.mockReturnValue(createMockQuery(null));

      await expect(service.findById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const mockUser = getMockUser();
      userModel.findById.mockReturnValue(createMockQuery(mockUser));
      userModel.findOne.mockReturnValue(createMockQuery(null));

      const result = await service.update('user1', {
        profile: { fullName: 'Updated' },
      } as any);
      expect(result._id).toBe('user1');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user', async () => {
      const mockUser = getMockUser();
      userModel.findById.mockReturnValue(createMockQuery(mockUser));

      const result = await service.deactivate('user1', 'admin1');
      expect(mockUser.profile.isActive).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockUser = getMockUser();
      userModel.findById.mockReturnValue(createMockQuery(mockUser));
      userModel.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await service.delete('user1', 'admin1');
      expect(result.message).toBe('User deleted successfully');
    });
  });
});
