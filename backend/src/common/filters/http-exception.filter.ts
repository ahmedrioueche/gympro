import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Handle both string and object responses
    let message: string;
    let errorCode: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message;
      errorCode = responseObj.errorCode;
    } else {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      message,
      ...(errorCode && { errorCode }),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}

