import { UsersRepository } from './../../../infrastructure/users.respository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.usersRepository.getUserByIdOrFail(command.userId);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
