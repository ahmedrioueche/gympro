// src/common/middleware/logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`📥 ${method} ${originalUrl} - ${ip}`);

    // Log request body (be careful with sensitive data)
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = this.sanitizeBody(req.body);
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    // Log response
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;

      const emoji = statusCode >= 500 ? '❌' : statusCode >= 400 ? '⚠️' : '✅';

      this.logger.log(
        `${emoji} ${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${duration}ms`,
      );
    });

    next();
  }

  private sanitizeBody(body: any): any {
    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'accessToken',
      'refreshToken',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
