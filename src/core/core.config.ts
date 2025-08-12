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

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  })
  isTestingModuleIncluded: boolean;

  constructor(private configService: ConfigService<any, true>) {
    this.port = Number(this.configService.get('PORT'));
    this.mongoURL = this.configService.get('MONGO_URL');
    this.isTestingModuleIncluded = configValidationUtility.convertToBoolean(
      this.configService.get('IS_TESTING_MODULE_INCLUDED'),
    );

    configValidationUtility.validateConfig(this);
  }
}
