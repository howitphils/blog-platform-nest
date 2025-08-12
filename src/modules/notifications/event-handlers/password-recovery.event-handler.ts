/* eslint-disable @typescript-eslint/no-floating-promises */
import { PasswordRecoveryEvent } from '../events/password-recovery.event';
import { EmailSendingService } from '../services/email-sending.service';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PasswordRecoveryEvent)
export class PasswordRecoveryEventHandler
  implements IEventHandler<PasswordRecoveryEvent>
{
  constructor(private emailSendingService: EmailSendingService) {}

  handle(event: PasswordRecoveryEvent) {
    try {
      this.emailSendingService.sendEmailForPasswordRecovery(
        event.email,
        event.recoveryCode,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
