import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';
import { initAppModule } from './init-app-module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();

  const adapter = new ExpressAdapter();
  adapter.set('trust proxy', true);

  const app = await NestFactory.create(dynamicAppModule, adapter);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  appSetup(app);

  await app.listen(coreConfig.port);
}

void bootstrap();
