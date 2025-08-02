import { Extension } from './extension';

export class ErrorsMessages {
  errorsMessages: Extension[];

  static createInstanceWithArray(errors: Extension[]): ErrorsMessages {
    const errMessages = new ErrorsMessages();

    errMessages.errorsMessages = errors;

    return errMessages;
  }

  static createInstance(field: string, message: string) {
    const errMessages = new ErrorsMessages();

    const extension = Extension.createInstance(field, message);

    errMessages.errorsMessages = [extension];

    return errMessages;
  }
}
