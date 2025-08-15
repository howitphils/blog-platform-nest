import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception.codes';
import { SessionsRepository } from './../../../infrastructure/sessions.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteSessionCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteSessionCommand): Promise<void> {
    const targetSession = await this.sessionsRepository.findByDeviceId(
      command.deviceId,
    );

    if (!targetSession) {
      throw new DomainException(
        'Session is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    targetSession.makeDeleted(command.userId);

    await this.sessionsRepository.save(targetSession);
  }
}
