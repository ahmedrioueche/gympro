import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;

  describe('when Vonage credentials are missing', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SmsService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(undefined),
            },
          },
        ],
      }).compile();

      service = module.get<SmsService>(SmsService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return error when sending SMS without credentials', async () => {
      const result = await service.sendSMS({
        to: '+1234567890',
        from: 'GymPro',
        text: 'Test message',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('SMS service not configured');
    });
  });

  describe('send convenience method', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SmsService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(undefined),
            },
          },
        ],
      }).compile();

      service = module.get<SmsService>(SmsService);
    });

    it('should call sendSMS with correct dto', async () => {
      const spy = jest.spyOn(service, 'sendSMS');
      await service.send('+1234567890', 'GymPro', 'Hello');
      expect(spy).toHaveBeenCalledWith({
        to: '+1234567890',
        from: 'GymPro',
        text: 'Hello',
      });
    });
  });
});
