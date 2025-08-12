import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './app.pipes-setup';
import { swaggerSetup } from './app.swagger-setup';
import { exceptionFilterSetup } from './app.exception-filter.setup';
import cookieParser from 'cookie-parser';

export function appSetup(app: INestApplication) {
  app.enableCors();
  app.use(cookieParser());

  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app);
}
