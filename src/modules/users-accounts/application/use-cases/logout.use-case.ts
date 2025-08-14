import { SessionsRepository } from './../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutDto } from '../../dto/logout.dto';

export class LogoutCommand {
  constructor(public dto: LogoutDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute({ dto }: LogoutCommand): Promise<void> {
    const session = await this.sessionsRepository.findByDeviceIdAndIssuedAt(
      dto.iat,
      dto.deviceId,
    );

    if (!session) {
      throw new DomainException(
        'Session not found',
        DomainExceptionCodes.Unauthorized,
      );
    }

    session.makeDeleted();

    await this.sessionsRepository.save(session);
  }
}
