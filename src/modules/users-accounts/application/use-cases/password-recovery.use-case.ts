import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { EmailSendingService } from '../services/email-sending.service';

export class RecoverPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordHandler
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailSendingService: EmailSendingService,
  ) {}

  async execute(dto: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.getUserByLoginOrEmail(dto.email);

    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.emailSendingService.sendEmailForPasswordRecovery(
      dto.email,
      user.passwordRecovery.recoveryCode,
    );
  }
}
