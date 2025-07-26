import { DomainExceptionCodes } from './domain-exception.codes';
import { Extension } from './extension';

export class DomainException extends Error {
  message: string;
  code: DomainExceptionCodes;
  extensions: Extension[];

  constructor(
    message: string,
    code: DomainExceptionCodes,
    extensions?: Extension[],
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.extensions = extensions || [];
  }
}
