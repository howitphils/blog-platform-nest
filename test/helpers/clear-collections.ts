import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { appConfig } from '../../src/app.config';
import { App } from 'supertest/types';

export const clearCollections = async (app: INestApplication<App>) => {
  return request(app.getHttpServer())
    .delete(appConfig.CLEAR_COLLETIONS_PATH)
    .expect(HttpStatus.NO_CONTENT);
};
