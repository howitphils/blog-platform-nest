import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/filters/all.exceptions-filter';
import { DomainHttpExceptionsFilter } from '../core/exceptions/filters/domain.exceptions-filter';
import { ThrottlerHttpExceptionFilter } from '../core/exceptions/filters/throttler.exception-filter';

export const exceptionFilterSetup = (app: INestApplication) => {
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new DomainHttpExceptionsFilter(),
    new ThrottlerHttpExceptionFilter(),
  );
};
