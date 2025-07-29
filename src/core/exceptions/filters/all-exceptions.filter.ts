import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainExceptionCodes } from '../domain-exception.codes';
import { ErrorResponseBody } from './error-response.body';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: { message: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const message = exception.message || 'Unexpected error';
    const resBody = this.buildResponseBody(req.url, message);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(resBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string,
  ): ErrorResponseBody {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        message: 'some error occured',
        path: null,
        code: DomainExceptionCodes.InternalServerError,
        extensions: [],
      };
    }

    return {
      timestamp: new Date().toISOString(),
      message,
      path: requestUrl,
      code: DomainExceptionCodes.InternalServerError,
      extensions: [],
    };
  }
}
