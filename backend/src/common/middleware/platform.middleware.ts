// src/common/middleware/platform.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { detectPlatform, Platform } from '../utils/platform.util';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      platform?: Platform;
    }
  }
}

@Injectable()
export class PlatformMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Detect and attach platform to request
    req.platform = detectPlatform(
      req.headers['user-agent'] || '',
      req.headers['x-app-platform'] as string,
    );
    next();
  }
}
