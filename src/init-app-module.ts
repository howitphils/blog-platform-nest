import { NestFactory } from '@nestjs/core';
import { CoreConfig } from './core/core.config';
import { AppModule } from './app.module';

export const initAppModule = async () => {
  const appCtx = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appCtx.get<CoreConfig>(CoreConfig);
  await appCtx.close();

  return AppModule.forRoot(coreConfig);
};
