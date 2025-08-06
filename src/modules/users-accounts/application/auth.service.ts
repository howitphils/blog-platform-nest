/* eslint-disable @typescript-eslint/no-floating-promises */
import { EmailSendingService } from './services/email-sending.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.respository';
import { LoginUserDto } from '../dto/login-user.dto';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { ConfirmPasswordRecoveryDto } from '../dto/confirm-password-recovery.dto';
import { ErrorsMessages } from 'src/core/exceptions/errorsMessages';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private bcryptAdapter: PasswordService,
    private jwtService: JwtService,
    private nodeMailerAdapter: EmailSendingService,
  ) {}

  async loginUser(dto: LoginUserDto): Promise<{ accessToken: string }> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const isCorrect = await this.bcryptAdapter.verifyPassword(
      password,
      user.accountData.passwordHash,
    );

    if (!isCorrect) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const accessToken = await this.jwtService.signAsync({
      id: user._id.toString(),
    });

    return { accessToken };
  }

  async registerUser(dto: CreateUserDto) {
    const createdId = await this.usersService.createUser(dto);
    const user = await this.usersRepository.getUserByIdOrFail(createdId);

    this.nodeMailerAdapter.sendEmailForRegistration(
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

    this.nodeMailerAdapter.sendEmailForRegistration(
      email,
      updatedUser.emailConfirmation.confirmationCode,
    );
  }

  async recoverPassword(email: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) return;

    this.nodeMailerAdapter.sendEmailForPasswordRecovery(
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

    const passwordHash = await this.bcryptAdapter.generateHash(dto.newPassword);

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
