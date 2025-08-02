import { DomainExceptionCodes } from './domain-exception.codes';
import { ErrorsMessages } from './errorsMessages';

export class DomainException extends Error {
  message: string;
  code: DomainExceptionCodes;
  errorsObject: ErrorsMessages | undefined;

  constructor(
    message: string,
    code: DomainExceptionCodes,
    erorrsObject?: ErrorsMessages,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.errorsObject = erorrsObject;
  }
}
