import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';
import { initAppModule } from './init-app-module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();

  const app = await NestFactory.create(dynamicAppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);
  appSetup(app);

  await app.listen(coreConfig.port);
}

void bootstrap();
