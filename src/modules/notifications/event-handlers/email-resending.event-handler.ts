/* eslint-disable @typescript-eslint/no-floating-promises */
import { EmailResendingEvent } from '../events/email-resending.event';
import { EmailSendingService } from './../services/email-sending.service';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(EmailResendingEvent)
export class EmailResendingEventHandler
  implements IEventHandler<EmailResendingEvent>
{
  constructor(private emailSendingService: EmailSendingService) {}

  handle(event: EmailResendingEvent) {
    try {
      this.emailSendingService.sendEmailForRegistration(
        event.email,
        event.confirmationCode,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
