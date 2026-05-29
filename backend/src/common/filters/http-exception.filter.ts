import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let errorCode: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const respObj = exceptionResponse as any;
      message = respObj.message || exception.message;
      errorCode = respObj.errorCode;
    } else {
      message = exception.message;
    }

    if (status === 429) {
      errorCode = ErrorCode.TOO_MANY_REQUESTS;
      message =
        'Please wait 1 minute before requesting another verification code.';
    } else if (message?.includes('ThrottlerException')) {
      message = message.replace(/^ThrottlerException:\s*/i, '').trim();
      if (!errorCode && status === 429) {
        errorCode = ErrorCode.TOO_MANY_REQUESTS;
      }
    }

    // Use apiResponse to format the response
    response.status(status).json(apiResponse(false, errorCode, null, message));
  }
}
