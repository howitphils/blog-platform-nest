import { SessionsRepository } from './../../infrastructure/sessions.repository';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from '../../../../app.settings';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { TokenPair } from '../../dto/token-pair.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokensDto } from '../../dto/refresh-tokens.dto';

export class RefreshTokensCommand {
  constructor(public dto: RefreshTokensDto) {}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler
  implements ICommandHandler<RefreshTokensCommand>
{
  constructor(
    private sessionsRepository: SessionsRepository,
    @Inject(appSettings.ACCESS_TOKEN_SERVICE)
    private jwtAccessService: JwtService,
    @Inject(appSettings.REFRESH_TOKEN_SERVICE)
    private jwtRefreshService: JwtService,
  ) {}

  async execute({ dto }: RefreshTokensCommand): Promise<TokenPair> {
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

    const accessToken = await this.jwtAccessService.signAsync({
      id: dto.userId,
    });

    const refreshToken = await this.jwtRefreshService.signAsync({
      id: dto.userId,
      deviceId: dto.deviceId,
    });

    const { exp, iat } = this.jwtRefreshService.decode<{
      iat: number;
      exp: number;
    }>(refreshToken);

    session.updateIatAndExp(iat, exp);

    await this.sessionsRepository.save(session);

    return { accessToken, refreshToken };
  }
}
