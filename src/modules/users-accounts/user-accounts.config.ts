import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../../setup/config.setup-utility';

@Injectable()
export class UserAccountsConfig {
  @IsNotEmpty({
    message: "Set Env variable ACCESS_TOKEN_EXPIRES_IN, for example: '5m'",
  })
  accessTokenExp: string;

  @IsNotEmpty({
    message: "Set Env variable REFRESH_TOKEN_EXPIRES_IN, for example: '5d'",
  })
  refreshTokenExp: string;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_COOKIE_NAME',
  })
  refreshTokenCookieName: string;

  @IsNotEmpty({
    message: 'Set Env variable THROTTLER_TTL',
  })
  @IsNumber({}, { message: 'Set Env variable THROTTLER_TTL to number' })
  throttlerTtl: number;

  @IsNotEmpty({
    message: 'Set Env variable REQUEST_LIMIT',
  })
  @IsNumber({}, { message: 'Set Env variable REQUEST_LIMIT to number' })
  requestLimit: number;

  constructor(private configService: ConfigService<any, true>) {
    this.accessTokenExp = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
    this.refreshTokenExp = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
    this.refreshTokenCookieName = this.configService.get(
      'REFRESH_TOKEN_COOKIE_NAME',
    );
    this.throttlerTtl = Number(this.configService.get('THROTTLER_TTL'));
    this.requestLimit = Number(this.configService.get('REQUEST_LIMIT'));

    configValidationUtility.validateConfig(this);
  }
}
