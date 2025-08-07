import { EmailSendingService } from './../services/email-sending.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.respository';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../../core/exceptions/errorsMessages';

export class ResendEmailConfirmatoinCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendEmailConfirmatoinCommand)
export class ResendEmailConfirmatoinHandler
  implements ICommandHandler<ResendEmailConfirmatoinCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailSendingService: EmailSendingService,
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.emailSendingService.sendEmailForRegistration(
      updatedUser.accountData.email,
      updatedUser.emailConfirmation.confirmationCode,
    );
  }
}
