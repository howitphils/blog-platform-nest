import { DomainExceptionCodes } from '../domain-exception.codes';
import { Extension } from '../extension';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCodes;
};
