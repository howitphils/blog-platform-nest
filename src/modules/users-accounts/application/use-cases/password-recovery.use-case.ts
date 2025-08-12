import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { PasswordRecoveryEvent } from '../../../notifications/events/password-recovery.event';

export class RecoverPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordHandler
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(dto: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.getUserByLoginOrEmail(dto.email);

    if (!user) return;

    this.eventBus.publish(
      new PasswordRecoveryEvent(
        user.accountData.email,
        user.passwordRecovery.recoveryCode,
      ),
    );
  }
}
