import { HttpStatus } from '@nestjs/common';
import { appConfig } from '../../src/app.config';
import TestAgent from 'supertest/lib/agent';

export const clearCollections = async (req: TestAgent) => {
  return req
    .delete(appConfig.CLEAR_COLLETIONS_PATH)
    .expect(HttpStatus.NO_CONTENT);
};
