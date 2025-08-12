import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../setup/config.setup-utility';

@Injectable()
export class NotificationsConfig {
  @IsNotEmpty({ message: 'Set Env variable NODEMAILER_MAIL_SERVICE' })
  mailService: string;

  @IsNotEmpty({
    message: 'Set Env variable NODEMAILER_USERNAME',
  })
  senderUserName: string;

  @IsNotEmpty({ message: 'Set Env variable NODEMAILER_PASSWORD' })
  senderPassword: string;

  constructor(private configService: ConfigService<any, true>) {
    this.mailService = this.configService.get('NODEMAILER_MAIL_SERVICE');
    this.senderUserName = this.configService.get('NODEMAILER_USERNAME');
    this.senderPassword = this.configService.get('NODEMAILER_PASS');

    configValidationUtility.validateConfig(this);
  }
}
