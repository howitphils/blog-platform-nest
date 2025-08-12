import { configModule } from './config.dynamic-module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountsModule } from './modules/users-accounts/users-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { appConfig } from './app.settings';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MailerModule } from '@nestjs-modules/mailer';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api-docs',
    }),
    CqrsModule.forRoot(),
    MongooseModule.forRoot(appConfig.MONGO_URL),
    NotificationsModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    configModule, // для .env файлов
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
