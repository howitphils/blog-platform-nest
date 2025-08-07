import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { ConfirmPasswordRecoveryDto } from '../../dto/confirm-password-recovery.dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { PasswordService } from '../services/password.service';

export class RecoverPasswordCommand {
  constructor(public dto: ConfirmPasswordRecoveryDto) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordHandler
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async execute({ dto }: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.getUserByRecoveryCode(
      dto.recoveryCode,
    );

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    const passwordHash = await this.passwordService.generateHash(
      dto.newPassword,
    );

    user.confirmPasswordRecovery(passwordHash);

    await this.usersRepository.save(user);
  }
}
