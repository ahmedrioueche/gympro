import { User } from '@client';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  getTestUser(): User {
    return {
      id: '1',
      name: 'Ahmed',
      email: 'adsrahmed@example.com',
    };
  }
}
