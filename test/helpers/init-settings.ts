import { MongooseModule } from '@nestjs/mongoose';
import { TestingModuleBuilder, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';
import { appConfig } from '../../src/app.config';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestManager } from './test-manager';
import { EmailSendingService } from '../../src/modules/users-accounts/application/services/email-sending.service';
import { EmailSendingServiceMock } from '../mocks/email-service.mock';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [MongooseModule.forRoot(appConfig.MONGO_URL_TEST), AppModule],
  });

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder
    .overrideProvider(EmailSendingService)
    .useClass(EmailSendingServiceMock)
    .compile();

  const app: INestApplication<App> = testingAppModule.createNestApplication();

  appSetup(app);

  await app.init();

  const req = request(app.getHttpServer());

  const testManger = new TestManager(req);

  return {
    app,
    req,
    testManger,
  };
};
