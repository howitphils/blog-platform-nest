import { UsersRepository } from './../../infrastructure/users.respository';
import { UserFactory } from './../factories/users.factory';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { EmailSendingService } from '../services/email-sending.service';

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private userFactory: UserFactory,
    private usersRepository: UsersRepository,
    private emailSendingService: EmailSendingService,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
    const user = await this.userFactory.create(dto);

    await this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.emailSendingService.sendEmailForRegistration(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
    );
  }
}
