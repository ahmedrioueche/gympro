import { UserProfile } from '@client';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  getTestUser(): UserProfile {
    return {
      _id: '423423',
      role: 'member',
      username: 'ahmed',
      fullName: 'ahmed drioueche',
      email: 'adsrahmed@gmail.com',
      gym: { _id: 'Fsdfsdfsd', name: 'gym' },
      createdAt: 'date',
    };
  }
}
