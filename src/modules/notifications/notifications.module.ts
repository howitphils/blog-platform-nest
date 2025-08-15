import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailSendingService } from './services/email-sending.service';
import { UserRegisteredEventHandler } from './event-handlers/user-registration.event-handler';
import { EmailResendingEventHandler } from './event-handlers/email-resending.event-handler';
import { PasswordRecoveryEventHandler } from './event-handlers/password-recovery.event-handler';
import { NotificationsConfig } from './config/notifications.config';
import { MailerProviderModule } from './mailer.provider-module';

const eventHandlers = [
  UserRegisteredEventHandler,
  EmailResendingEventHandler,
  PasswordRecoveryEventHandler,
];

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: NotificationsConfig): MailerOptions => {
        return {
          transport: {
            service: config.mailService,
            auth: {
              user: config.senderUserName,
              pass: config.senderPassword,
            },
          },
        };
      },
      inject: [NotificationsConfig],
      imports: [MailerProviderModule],
    }),
  ],
  providers: [EmailSendingService, ...eventHandlers],
})
export class NotificationsModule {}
