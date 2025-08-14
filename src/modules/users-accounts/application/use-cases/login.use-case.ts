import { SessionModelType } from './../../domain/session.entity';
import { SessionRepository } from './../../infrastructure/sessions.repository';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { appSettings } from '../../../../app.settings';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { LoginUserDto } from '../../dto/login-user.dto';
import { TokenPair } from '../../dto/token-pair.dto';
import { UsersRepository } from '../../infrastructure/users.respository';
import { PasswordService } from '../services/password.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../../domain/session.entity';

export class LoginUserCommand {
  constructor(public dto: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
    private usersRepository: UsersRepository,
    private sessionRepository: SessionRepository,
    private passwordService: PasswordService,
    @Inject(appSettings.ACCESS_TOKEN_SERVICE)
    private jwtAccessService: JwtService,
    @Inject(appSettings.REFRESH_TOKEN_SERVICE)
    private jwtRefreshService: JwtService,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<TokenPair> {
    const { loginOrEmail, password, deviceName, ip } = dto;

    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const isCorrect = await this.passwordService.verifyPassword(
      password,
      user.accountData.passwordHash,
    );

    if (!isCorrect) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const accessToken = await this.jwtAccessService.signAsync({
      id: user._id.toString(),
    });

    const refreshToken = await this.jwtRefreshService.signAsync({
      id: user._id.toString(),
      device_id: randomUUID(),
    });

    const { exp, iat } = this.jwtRefreshService.decode<{
      iat: number;
      exp: number;
    }>(refreshToken);

    const newSession = this.SessionModel.createSession({
      userId: user._id.toString(),
      deviceId: randomUUID(),
      deviceName,
      ip,
      exp,
      iat,
    });

    await this.sessionRepository.save(newSession);

    return { accessToken, refreshToken };
  }
}
