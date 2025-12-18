import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('wake-up')
  wake() {
    return {
      status: 'awake',
      timestamp: new Date().toISOString(),
    };
  }
}
