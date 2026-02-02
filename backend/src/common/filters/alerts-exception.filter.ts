import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Catch()
export class AlertsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AlertsExceptionFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    // If it's a 500 error, trigger an automated alert
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('CRITICAL: 500 Internal Server Error detected');

      try {
        const error = exception as Error;
        this.eventEmitter.emit('error.critical', {
          title: 'Internal Server Error (500)',
          message: `Unhandled exception at ${responseBody.path}: ${error.message || 'Unknown error'}`,
          stack: error.stack,
          metadata: {
            path: responseBody.path,
            timestamp: responseBody.timestamp,
          },
        });
      } catch (err) {
        this.logger.error('Failed to emit automated alert event:', err);
      }
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
