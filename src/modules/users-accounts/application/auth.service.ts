/* eslint-disable @typescript-eslint/no-floating-promises */
import { NodeMailerAdapter } from './../infrastructure/adapters/nodemailer.adapter';
import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from './../infrastructure/adapters/bcrypt.adapter';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.respository';
import { LoginUserDto } from '../dto/login-user.dto';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { ConfirmPasswordRecoveryDto } from '../dto/confirm-password-recovery.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private bcryptAdapter: BcryptAdapter,
    private jwtService: JwtService,
    private nodeMailerAdapter: NodeMailerAdapter,
  ) {}

  async loginUser(dto: LoginUserDto): Promise<{ accessToken: string }> {
    const { loginOrEmail, password } = dto;

    const targetUser =
      await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);

    const isCorrect = await this.bcryptAdapter.verifyPassword(
      password,
      targetUser.accountData.passwordHash,
    );

    if (!isCorrect) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const accessToken = await this.jwtService.signAsync({
      id: targetUser._id.toString(),
    });

    return { accessToken };
  }

  async registerUser(dto: CreateUserDto) {
    const createdId = await this.usersService.createUser(dto);
    const targetUser = await this.usersRepository.getUserById(createdId);

    this.nodeMailerAdapter.sendEmailForRegistration(
      targetUser.accountData.email,
      targetUser.emailConfirmation.confirmationCode,
    );
  }

  async confirmRegistration(confirmationCode: string): Promise<void> {
    const user =
      await this.usersRepository.getUserByConfirmationCode(confirmationCode);

    user.confirmRegistration();

    await this.usersRepository.save(user);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    user.updateEmailConfirmationCode();

    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.getUserByLoginOrEmail(email);

    this.nodeMailerAdapter.sendEmailForRegistration(
      email,
      updatedUser.emailConfirmation.confirmationCode,
    );
  }

  async recoverPassword(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

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
