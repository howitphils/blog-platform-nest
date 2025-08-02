import { Extension } from './extension';

export class ErrorsMessages {
  errorsMessages: Extension[];

  static createInstance(errors: Extension[]): ErrorsMessages {
    return {
      errorsMessages: errors,
    };
  }
}
