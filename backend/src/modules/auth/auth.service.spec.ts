import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppSubscriptionService } from '../app-billing/subscription/subscription.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: any;

  const getMockUser = () => ({
    _id: 'user1',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    profile: {
      fullName: 'Test User',
      isActive: true,
      isValidated: true,
      email: 'test@example.com',
    },
    role: 'member',
    isActive: true,
    isVerified: true,
    refreshToken: null,
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnValue({
      _id: 'user1',
      profile: { fullName: 'Test User', email: 'test@example.com' },
      role: 'member',
    }),
    populate: jest.fn().mockReturnThis(),
  });

  const createMockQuery = (result: any) => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
    then: jest.fn().mockImplementation((resolve) => resolve(result)),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken('AppPlanModel'),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: AppSubscriptionService,
          useValue: {
            getMySubscription: jest.fn().mockResolvedValue(null),
            subscribe: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyUser: jest.fn().mockResolvedValue(undefined),
            notifyStaff: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest
              .fn()
              .mockReturnValue({ sub: 'user1', email: 'test@example.com' }),
            signAsync: jest.fn().mockResolvedValue('mock-token'),
            verifyAsync: jest
              .fn()
              .mockResolvedValue({ sub: 'user1', email: 'test@example.com' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string> = {
                JWT_SECRET: 'test-secret',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
                FRONTEND_URL: 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
        {
          provide: OtpService,
          useValue: {
            generateOtp: jest.fn().mockReturnValue('123456'),
            verifyOtp: jest.fn().mockReturnValue(true),
            sendOTP: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken('User'));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logout', () => {
    it('should return successfully', async () => {
      const result = await service.logout('user1');
      expect(result.message).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid');
      });

      await expect(service.refresh('invalid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getMeFromPayload', () => {
    it('should return user data from JWT payload', async () => {
      userModel.findById.mockReturnValue(createMockQuery(getMockUser()));

      const result = await service.getMeFromPayload({
        sub: 'user1',
        email: 'test@example.com',
      } as any);
      expect(result).toBeDefined();
    });
  });

  describe('sanitizeUser', () => {
    it('should remove password from user profile', () => {
      const user = {
        _id: 'user1',
        email: 'test@example.com',
        profile: { fullName: 'Test User', password: 'hashed' },
        refreshToken: 'token',
      };
      const sanitized = service.sanitizeUser({ ...user });
      expect(sanitized.profile?.password).toBeUndefined();
    });
  });
});
