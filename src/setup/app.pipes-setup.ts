import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';
import { Extension } from 'src/core/exceptions/extension';

const formatErrors = (errors: ValidationError[]): Extension[] => {
  return errors.map((error) => {
    // console.log(error)

    let key = '';
    if (error.constraints) {
      key = Object.keys(error.constraints)[0];

      return {
        field: error.property,
        message: error.constraints[key],
      };
    } else {
      return {
        field: error.property,
        message: 'Invalid field value',
      };
    }
  });
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        throw new DomainException(
          'Validation failed',
          DomainExceptionCodes.BadRequest,
          formatErrors(errors),
        );
      },
    }),
  );
}
