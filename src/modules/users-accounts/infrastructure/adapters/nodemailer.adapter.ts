/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailerAdapter {
  constructor(private readonly mailService: MailerService) {}

  async sendEmailForRegistration(email: string, confirmationCode: string) {
    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`;

    this.sendEmail(email, 'registration for blog platform', message).catch(
      (e) => {
        console.log(e, 'registration/resending');
      },
    );
  }

  async sendEmailForPasswordRecovery(email: string, recoveryCode: string) {
    const message = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;

    this.sendEmail(email, 'password recovery', message).catch((e) =>
      console.log(e, 'password recovery'),
    );
  }

  private async sendEmail(email: string, subject: string, message: string) {
    this.mailService.sendMail({
      from: process.env.NODEMAILER_USERNAME,
      to: email,
      subject,
      text: message,
    });
  }
}
