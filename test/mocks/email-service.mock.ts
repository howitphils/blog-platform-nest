/* eslint-disable @typescript-eslint/require-await */
import { EmailSendingService } from '../../src/modules/users-accounts/application/services/email-sending.service';

export class EmailSendingServiceMock extends EmailSendingService {
  // перезапись методов
  async sendEmailForRegistration(): Promise<void> {
    console.log('registration/resending email sending mock');
    return;
  }
  async sendEmailForPasswordRecovery(): Promise<void> {
    console.log('password recovery email sending mock');
    return;
  }
}
