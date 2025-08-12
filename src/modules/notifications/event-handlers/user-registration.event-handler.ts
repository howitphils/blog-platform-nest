/* eslint-disable @typescript-eslint/no-floating-promises */
import { UserRegisteredEvent } from '../events/user-registered.event';
import { EmailSendingService } from './../services/email-sending.service';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private emailSendingService: EmailSendingService) {}

  handle(event: UserRegisteredEvent) {
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
