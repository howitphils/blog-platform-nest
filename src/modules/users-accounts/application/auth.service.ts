/* eslint-disable @typescript-eslint/no-floating-promises */
import { EmailSendingService } from '../../notifications/services/email-sending.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.respository';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { ConfirmPasswordRecoveryDto } from '../dto/confirm-password-recovery.dto';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../core/exceptions/errorsMessages';
import { appSettings } from '../../../app.settings';
import { TokenPair } from '../dto/token-pair.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private passwordService: PasswordService,
    @Inject(appSettings.ACCESS_TOKEN_SERVICE)
    private jwtAccessService: JwtService,
    @Inject(appSettings.REFRESH_TOKEN_SERVICE)
    private jwtRefreshService: JwtService,
    private emailSendingService: EmailSendingService,
  ) {}

  async loginUser(dto: LoginUserDto): Promise<TokenPair> {
    const { loginOrEmail, password } = dto;

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

    return { accessToken, refreshToken };
  }

  async registerUser(dto: CreateUserDto) {
    const createdId = await this.usersService.createUser(dto);
    const user = await this.usersRepository.getUserByIdOrFail(createdId);

    this.emailSendingService.sendEmailForRegistration(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
    );
  }

  async confirmRegistration(confirmationCode: string): Promise<void> {
    const user =
      await this.usersRepository.getUserByConfirmationCode(confirmationCode);

    if (!user) {
      throw new DomainException(
        'Confirmation failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('code', 'User not found'),
      );
    }

    user.confirmRegistration();

    await this.usersRepository.save(user);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new DomainException(
        'Confirmation resending failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('email', 'User not found'),
      );
    }

    user.updateEmailConfirmationCode();

    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.getUserByEmail(email);

    if (!updatedUser) {
      throw new Error('Updated user not found');
    }

    this.emailSendingService.sendEmailForRegistration(
      email,
      updatedUser.emailConfirmation.confirmationCode,
    );
  }

  async recoverPassword(email: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) return;

    this.emailSendingService.sendEmailForPasswordRecovery(
      email,
      user.passwordRecovery.recoveryCode,
    );
  }

  async confirmPasswordRecovery(dto: ConfirmPasswordRecoveryDto) {
    const user = await this.usersRepository.getUserByRecoveryCode(
      dto.recoveryCode,
    );

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    const passwordHash = await this.passwordService.generateHash(
      dto.newPassword,
    );

    user.confirmPasswordRecovery(passwordHash);

    await this.usersRepository.save(user);
  }

  // async logout(dto: RefreshTokensAndLogoutDto): Promise<void> {
  //   const targetSession =
  //     await this.sessionsRepository.findByDeviceIdAndIssuedAt(
  //       dto.issuedAt,
  //       dto.deviceId,
  //     );

  //   if (!targetSession) {
  //     throw new ErrorWithStatusCode(
  //       APP_CONFIG.ERROR_MESSAGES.SESSION_NOT_FOUND,
  //       HttpStatuses.Unauthorized,
  //     );
  //   }

  //   if (targetSession.iat !== dto.issuedAt) {
  //     throw new ErrorWithStatusCode(
  //       APP_CONFIG.ERROR_MESSAGES.REFRESH_TOKEN_IS_NOT_VALID,
  //       HttpStatuses.Unauthorized,
  //     );
  //   }

  //   await targetSession.deleteOne();
  // }

  // async refreshTokens(dto: RefreshTokensAndLogoutDto): Promise<TokenPairType> {
  //   const session = await this.sessionsRepository.findByDeviceIdAndIssuedAt(
  //     dto.issuedAt,
  //     dto.deviceId,
  //   );

  //   if (!session) {
  //     throw new ErrorWithStatusCode(
  //       APP_CONFIG.ERROR_MESSAGES.SESSION_NOT_FOUND,
  //       HttpStatuses.Unauthorized,
  //     );
  //   }

  //   const tokenPair = this.jwtService.createJwtPair(dto.userId, dto.deviceId);

  //   const { exp, iat } = this.jwtService.decodeToken(
  //     tokenPair.refreshToken,
  //   ) as JwtPayloadRefresh;

  //   session.updateSessionIatAndExp(iat as number, exp as number);

  //   await this.sessionsRepository.save(session);

  //   return tokenPair;
  // }
}
