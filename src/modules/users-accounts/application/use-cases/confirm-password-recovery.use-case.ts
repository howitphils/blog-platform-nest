import { EmailSendingService } from './../services/email-sending.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';

export class ConfirmPasswordRecovery {
  constructor(public email: string) {}
}

@CommandHandler(ConfirmPasswordRecovery)
export class ConfirmPasswordRecoveryHandler
  implements ICommandHandler<ConfirmPasswordRecovery>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailSendingService: EmailSendingService,
  ) {}

  async execute(dto: ConfirmPasswordRecovery): Promise<void> {
    const user = await this.usersRepository.getUserByLoginOrEmail(dto.email);

    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.emailSendingService.sendEmailForPasswordRecovery(
      dto.email,
      user.passwordRecovery.recoveryCode,
    );
  }
}
