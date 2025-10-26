import { Controller, Get } from '@nestjs/common';
import { User } from '@client';

@Controller()
export class AppController {
  @Get('test')
  getTestUser(): User {
    return {
      id: '1',
      name: 'Ahmed',
      email: 'ahmed@example.com',
    };
  }
}
