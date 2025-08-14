import { SessionsRepository } from './../../../infrastructure/sessions.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteAllSessions {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteAllSessions)
export class DeleteAllSessionsHandler
  implements ICommandHandler<DeleteAllSessions>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteAllSessions): Promise<void> {
    await this.sessionsRepository.deleteAllSessions(
      command.userId,
      command.deviceId,
    );

    const sessions = await this.sessionsRepository.findAllUsersSessions(
      command.userId,
    );

    if (sessions.length !== 1) {
      throw new Error(
        'Session collection for this user was not cleared properly',
      );
    }
  }
}
