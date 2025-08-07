import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../../core/exceptions/errorsMessages';

export class ConfirmRegistrationCommand {
  constructor(public confirmationCode: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(dto: ConfirmRegistrationCommand): Promise<void> {
    const user = await this.usersRepository.getUserByConfirmationCode(
      dto.confirmationCode,
    );

    if (!user) {
      throw new DomainException(
        'Confirmation failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('code', 'User not found'),
      );
    }

    user.confirmRegistration();

    await this.usersRepository.save(user);
  }
}
