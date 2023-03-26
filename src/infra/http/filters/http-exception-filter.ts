import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { TokenExpiredError } from '@infra/database/prisma/errors/token-expired.error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const error = this.getError(exception.getResponse(), exception);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getError(error: string | object, exception: HttpException) {
    const cause = exception.cause;

    return typeof error === 'object'
      ? cause instanceof TokenExpiredError
        ? { ...error, expired: true }
        : error
      : {
          message: error,
        };
  }
}
