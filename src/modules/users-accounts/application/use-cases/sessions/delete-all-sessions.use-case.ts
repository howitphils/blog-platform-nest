import { SessionsRepository } from './../../../infrastructure/sessions.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteAllSessionsCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsHandler
  implements ICommandHandler<DeleteAllSessionsCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteAllSessionsCommand): Promise<void> {
    await this.sessionsRepository.deleteAllSessions(
      command.userId,
      command.deviceId,
    );

    const sessions = await this.sessionsRepository.findAllUsersSessions(
      command.userId,
    );

    if (sessions.length !== 1) {
      throw new Error('Session collection was not cleared properly');
    }
  }
}
