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
    const sessions = await this.sessionsRepository.findAllUsersSessions(
      command.userId,
    );

    await Promise.all(
      sessions.map((session) => {
        if (session.deviceId === command.deviceId) {
          return session;
        }
        session.makeDeleted(command.userId);
        return this.sessionsRepository.save(session);
      }),
    );
  }
}
