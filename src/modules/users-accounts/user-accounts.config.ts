import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
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

  constructor(private configService: ConfigService<any, true>) {
    this.accessTokenExp = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
    this.refreshTokenExp = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
    this.refreshTokenCookieName = this.configService.get(
      'REFRESH_TOKEN_COOKIE_NAME',
    );

    configValidationUtility.validateConfig(this);
  }
}
