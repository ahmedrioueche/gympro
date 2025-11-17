import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Platform } from '../utils/platform.util';

export const ClientPlatform = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Platform => {
    const request = ctx.switchToHttp().getRequest();
    // Get platform that was attached by middleware
    return request.platform || Platform.WEB; // Fallback to WEB
  },
);
