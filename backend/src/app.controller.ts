import { BaseUserProfile } from '@client';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  getTestUser(): BaseUserProfile {
    return {
      _id: '423423',
      username: 'ahmed',
      fullName: 'ahmed drioueche',
      email: 'adsrahmed@gmail.com',
    };
  }
}
