import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getModelToken('AttendanceRecord'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {
            sendNotificationToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate a token for an active membership', async () => {
      const memberId = new Types.ObjectId().toString();
      const gymId = new Types.ObjectId().toString();
      const user = { _id: memberId };
      const membership = { _id: 'mem1', membershipStatus: 'active' };

      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      (service['userModel'].findById as jest.Mock).mockResolvedValue(user);
      (service['membershipModel'].findOne as jest.Mock).mockResolvedValue(membership);
      (service['jwtService'].sign as jest.Mock).mockReturnValue('mock_token');

      const result = await service.generateAccessToken(memberId, gymId);

      expect(result.success).toBe(true);
      expect(result.data?.token).toBe('mock_token');
    });

    it('should throw BadRequestException if no active membership found', async () => {
      const memberId = new Types.ObjectId().toString();
      const gymId = new Types.ObjectId().toString();

      (service['userModel'].findById as jest.Mock).mockResolvedValue({ _id: memberId });
      (service['membershipModel'].findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.generateAccessToken(memberId, gymId)).rejects.toThrow(
        'No active membership found for this gym',
      );
    });
  });

  describe('checkInByPin', () => {
    it('should process check-in for a valid PIN', async () => {
      const gymId = new Types.ObjectId().toString();
      const pin = '123456';
      const membership = { _id: 'mem1', user: 'user1' };

      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      (service['membershipModel'].findOne as jest.Mock).mockResolvedValue(membership);
      jest.spyOn(service as any, 'processCheckIn').mockResolvedValue({ success: true });

      const result = await service.checkInByPin(gymId, pin);

      expect(result.success).toBe(true);
      expect(service['membershipModel'].findOne).toHaveBeenCalledWith({
        gym: expect.any(Types.ObjectId),
        'accessData.pinCode': pin,
        membershipStatus: 'active',
      });
    });
  });

  describe('checkInByRfid', () => {
    it('should process check-in for a valid RFID', async () => {
      const gymId = new Types.ObjectId().toString();
      const rfidId = 'rfid123';
      const membership = { _id: 'mem1', user: 'user1' };

      jest.spyOn(service as any, 'toObjectId').mockImplementation((id: any) => new Types.ObjectId(id as string));
      (service['membershipModel'].findOne as jest.Mock).mockResolvedValue(membership);
      jest.spyOn(service as any, 'processCheckIn').mockResolvedValue({ success: true });

      const result = await service.checkInByRfid(gymId, rfidId);

      expect(result.success).toBe(true);
      expect(service['membershipModel'].findOne).toHaveBeenCalledWith({
        gym: expect.any(Types.ObjectId),
        'accessData.rfidId': rfidId,
        membershipStatus: 'active',
      });
    });
  });
});
