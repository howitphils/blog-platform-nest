import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './app.pipes-setup';
import { swaggerSetup } from './app.swagger-setup';

export function appSetup(app: INestApplication) {
  app.enableCors();
  pipesSetup(app);
  swaggerSetup(app);
}
