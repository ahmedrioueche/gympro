import { Controller, Get } from '@nestjs/common';

// Example type from your @client package
export interface BaseUserProfile {
  _id: string;
  username: string;
  fullName: string;
  email: string;
}

@Controller()
export class AppController {
  @Get('test')
  getTestUser(): BaseUserProfile {
    return {
      _id: '423423',
      username: 'ahmed',
      fullName: 'Ahmed Drioueche',
      email: 'adsrahmed@gmail.com',
    };
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
