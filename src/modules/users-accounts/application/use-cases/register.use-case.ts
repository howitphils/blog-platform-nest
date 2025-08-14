import { UsersRepository } from './../../infrastructure/users.respository';
import { UserFactory } from '../factories/users.factory';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRegisteredEvent } from '../../../notifications/events/user-registered.event';

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
    private eventBus: EventBus,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
    const user = await this.userFactory.create(dto);

    await this.usersRepository.save(user);

    this.eventBus.publish(
      new UserRegisteredEvent(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      ),
    );
  }
}
