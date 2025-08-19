import { configModule } from './config.dynamic-module';

import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountsModule } from './modules/users-accounts/users-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreConfig } from './core/core.config';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory(config: CoreConfig) {
        return { uri: config.mongoURL };
      },

      inject: [CoreConfig],
      imports: [CoreModule],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: CoreConfig) {
        return {
          type: 'postgres',
          host: config.postgresUrl,
          port: config.postgresPort,
          username: config.postgresUser,
          password: config.postgresPassword,
          database: config.postgresDbName,
          entities: [],
          synchronize: config.isSynchronized,
        };
      },
      inject: [CoreConfig],
      imports: [CoreModule],
    }),
    NotificationsModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    configModule, // для .env файлов
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static forRoot(coreConfig: CoreConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [...(coreConfig.isTestingModuleIncluded ? [TestingModule] : [])],
    };
  }
}
