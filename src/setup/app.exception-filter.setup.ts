import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from 'src/core/exceptions/filters/domain-exceptions.filter';

export const exceptionFilterSetup = (app: INestApplication) => {
  app.useGlobalFilters(
    new DomainHttpExceptionsFilter(),
    new AllExceptionsFilter(),
  );
};
