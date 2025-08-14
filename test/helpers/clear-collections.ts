import { HttpStatus } from '@nestjs/common';
import { appSettings } from '../../src/app.settings';
import TestAgent from 'supertest/lib/agent';

export const clearCollections = async (req: TestAgent) => {
  return req
    .delete(appSettings.CLEAR_COLLETIONS_PATH)
    .expect(HttpStatus.NO_CONTENT);
};
