import { UsersRepository } from './../../../infrastructure/users.respository';
import { UserFactory } from './../../factories/users.factory';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const user = await this.userFactory.create(command.dto);

    user.updateIsConfirmed();

    return this.usersRepository.save(user);
  }
}
