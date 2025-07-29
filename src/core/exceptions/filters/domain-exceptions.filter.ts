import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '../domain-exception';
import { Request, Response } from 'express';
import { DomainExceptionCodes } from '../domain-exception.codes';
import { ErrorResponseBody } from './error-response.body';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = this.mapToHttpStatus(exception.code);
    const resBody = this.buildResponse(exception, req.url);

    res.status(status).json(resBody);
  }

  private mapToHttpStatus(code: DomainExceptionCodes): number {
    switch (code) {
      case DomainExceptionCodes.BadRequest:
      case DomainExceptionCodes.ValidationError:
      case DomainExceptionCodes.ConfirmationCodeExpired:
      case DomainExceptionCodes.EmailNotConfirmed:
      case DomainExceptionCodes.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCodes.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCodes.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCodes.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCodes.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildResponse(
    exception: DomainException,
    url: string,
  ): ErrorResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: url,
      code: exception.code,
      message: exception.message,
      extensions: exception.extensions,
    };
  }
}
