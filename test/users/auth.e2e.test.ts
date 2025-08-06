import { INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let req: TestAgent;
  let testManager: TestManager;

  beforeAll(async () => {
    const result = await initSettings();

    app = result.app;
    req = result.req;
    testManager = result.testManger;
  });

  afterAll(async () => {
    await app.close();
  });
});
