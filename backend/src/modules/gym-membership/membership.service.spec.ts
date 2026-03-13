import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { MembershipService } from './membership.service';

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getModelToken('User'),
          useValue: { find: jest.fn().mockReturnThis(), findById: jest.fn().mockReturnThis(), findOne: jest.fn().mockReturnThis(), exec: jest.fn() },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            aggregate: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockResolvedValue({}),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: getModelToken('SubscriptionHistory'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            save: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateUniquePin', () => {
    it('should generate a 6-digit PIN that does not exist in the gym', async () => {
      const gymId = new Types.ObjectId().toString();
      
      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      ((service['membershipModel'] as any).exec as jest.Mock).mockResolvedValue(null);

      const pin = await service.generateUniquePin(gymId);

      expect(pin).toHaveLength(6);
      expect(/^\d+$/.test(pin)).toBe(true);
      expect((service['membershipModel'] as any).findOne).toHaveBeenCalled();
    });

    it('should retry if PIN already exists', async () => {
      const gymId = new Types.ObjectId().toString();
      
      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      ((service['membershipModel'] as any).exec as jest.Mock)
        .mockResolvedValueOnce({ _id: 'existing' })
        .mockResolvedValueOnce(null);

      const pin = await service.generateUniquePin(gymId);

      expect(pin).toHaveLength(6);
      expect((service['membershipModel'] as any).findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('createMember', () => {
    it('should create a member with PIN and RFID if provided', async () => {
      const dto = {
        fullName: 'Test User',
        email: 'test@example.com',
        gymId: new Types.ObjectId().toString(),
        pinCode: '123456',
        rfidId: 'rfid123',
      };
      const createdBy = 'admin1';

      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      ((service['gymModel'] as any).exec as jest.Mock).mockResolvedValue({ appSubscription: {} });
      
      const mockUser = {
        _id: 'user1',
        save: jest.fn().mockResolvedValue({}),
        memberships: [],
        subscriptionHistory: [],
        toObject: jest.fn().mockReturnThis(),
      };
      
      const UserModelMock = jest.fn().mockImplementation(() => mockUser);
      Object.assign(UserModelMock, service['userModel']);
      service['userModel'] = UserModelMock as any;
      ((UserModelMock as any).findOne as jest.Mock).mockResolvedValue(null);
      ((UserModelMock as any).exec as jest.Mock).mockResolvedValue(null);

      const mockMembership = {
        _id: 'mem1',
        save: jest.fn().mockResolvedValue({}),
        toObject: jest.fn().mockReturnValue({ _id: 'mem1' }),
      };

      const MembershipModelMock = jest.fn().mockImplementation(() => mockMembership);
      Object.assign(MembershipModelMock, service['membershipModel']);
      service['membershipModel'] = MembershipModelMock as any;
      ((MembershipModelMock as any).findOne as jest.Mock).mockResolvedValue(null);

      jest.spyOn(service as any, 'updateGymStats').mockResolvedValue(undefined);

      await service.createMember(dto as any, createdBy);

      expect(MembershipModelMock).toHaveBeenCalledWith(expect.objectContaining({
        accessData: {
          pinCode: '123456',
          rfidId: 'rfid123',
        }
      }));
    });
  });
});
