import { Module } from '@nestjs/common';
import { NotificationsConfig } from './config/notifications.config';

@Module({ providers: [NotificationsConfig], exports: [NotificationsConfig] })
export class MailerCoreModule {}
