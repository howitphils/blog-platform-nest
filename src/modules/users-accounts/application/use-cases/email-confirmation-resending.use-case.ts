import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../../core/exceptions/errorsMessages';
import { EmailResendingEvent } from '../../../notifications/events/email-resending.event';

export class ResendEmailConfirmatoinCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendEmailConfirmatoinCommand)
export class ResendEmailConfirmatoinHandler
  implements ICommandHandler<ResendEmailConfirmatoinCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(dto: ResendEmailConfirmatoinCommand): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(dto.email);

    if (!user) {
      throw new DomainException(
        'Confirmation resending failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('email', 'User not found'),
      );
    }

    user.updateEmailConfirmationCode();

    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.getUserByEmail(dto.email);

    if (!updatedUser) {
      throw new Error('Updated user not found');
    }

    this.eventBus.publish(
      new EmailResendingEvent(
        updatedUser.accountData.email,
        updatedUser.emailConfirmation.confirmationCode,
      ),
    );
  }
}
