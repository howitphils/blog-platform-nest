import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailSendingService } from './services/email-sending.service';
import { UserRegisteredEventHandler } from './event-handlers/user-registration.event-handler';
import { EmailResendingEventHandler } from './event-handlers/email-resending.event-handler';
import { PasswordRecoveryEventHandler } from './event-handlers/password-recovery.event-handler';

const eventHandlers = [
  UserRegisteredEventHandler,
  EmailResendingEventHandler,
  PasswordRecoveryEventHandler,
];

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: process.env.NODEMAILER_MAIL_SERVICE,
        auth: {
          user: process.env.NODEMAILER_USERNAME,
          pass: process.env.NODEMAILER_PASS,
        },
      },
    }),
  ],
  providers: [EmailSendingService, ...eventHandlers],
})
export class NotificationsModule {}
