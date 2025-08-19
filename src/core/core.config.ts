import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../setup/config.setup-utility';

@Injectable()
export class CoreConfig {
  @IsNumber({}, { message: 'Set Env variable PORT, example: 3000' })
  port: number;

  @IsNotEmpty({
    message:
      'Set Env variable MONGO_URL, example: mongodb://localhost:27017/my-app-local-db',
  })
  mongoURL: string;

  @IsNotEmpty({ message: 'Set Env variable ACCESS_JWT_SECRET' })
  jwtAccessSecret: string;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_JWT_SECRET',
  })
  jwtRefreshSecret: string;

  @IsNotEmpty({
    message: 'Set Env variable ADMIN_CREDENTIALS',
  })
  adminCredentials: string;

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  })
  isTestingModuleIncluded: boolean;

  @IsNotEmpty({ message: 'Set Env variable POSTGRES_PORT' })
  postgresPort: string;

  @IsNotEmpty({ message: 'Set Env variable POSTGRES_URL' })
  postgresUrl: string;

  @IsNotEmpty({ message: 'Set Env variable POSTGRES_USER' })
  postgresUser: string;

  @IsNotEmpty({ message: 'Set Env variable POSTGRES_PASSWORD' })
  postgresPassword: string;

  @IsNotEmpty({ message: 'Set Env variable POSTGRES_DB_NAME' })
  postgresDbName: string;

  constructor(private configService: ConfigService<any, true>) {
    this.port = Number(this.configService.get('PORT'));
    this.mongoURL = this.configService.get('MONGO_URL');
    this.isTestingModuleIncluded = configValidationUtility.convertToBoolean(
      this.configService.get('IS_TESTING_MODULE_INCLUDED'),
    );
    this.jwtAccessSecret = this.configService.get('ACCESS_JWT_SECRET');
    this.jwtRefreshSecret = this.configService.get('REFRESH_JWT_SECRET');
    this.adminCredentials = this.configService.get('ADMIN_CREDENTIALS');
    this.postgresPort = this.configService.get('POSTGRES_PORT');
    this.postgresUrl = this.configService.get('POSTGRES_URL');
    this.postgresUser = this.configService.get('POSTGRES_USER');
    this.postgresPassword = this.configService.get('POSTGRES_PASSWORD');
    this.postgresDbName = this.configService.get('POSTGRES_DB_NAME');

    configValidationUtility.validateConfig(this);
  }
}
