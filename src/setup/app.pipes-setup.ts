import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';
import { ErrorsMessages } from 'src/core/exceptions/errorsMessages';
import { Extension } from 'src/core/exceptions/extension';

const formatValidationErrors = (errors: ValidationError[]): Extension[] => {
  return errors.map((error) => {
    // console.log(error)

    let message = 'Invalid field value';

    if (error.constraints) {
      const key = Object.keys(error.constraints)[0];

      message = error.constraints[key];
    }

    return Extension.createInstance(error.property, message);
  });
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formatedErors = formatValidationErrors(errors);

        throw new DomainException(
          'Validation failed',
          DomainExceptionCodes.BadRequest,
          ErrorsMessages.createInstanceWithArray(formatedErors),
        );
      },
    }),
  );
}
