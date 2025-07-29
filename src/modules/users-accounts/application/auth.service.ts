import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from './../infrastructure/adapters/bcrypt.adapter';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.respository';
import { LoginUserDto } from './dto/login-user.dto';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private jwtService: JwtService,
  ) {}

  async loginUser(dto: LoginUserDto): Promise<TokenPairType> {
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

    this.jwtService.

    // const tokenPair = this.jwtService.createJwtPair(
    //   targetUser._id.toString(),
    //   deviceId,
    // );

    return tokenPair;
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

  async registerUser(dto: UserInputModel) {
    const createdId = await this.usersService.createNewUser(dto, false);
    const targetUser = await this.usersService.getUserById(createdId);

    this.emailManager
      .sendEmailForRegistration(
        targetUser.accountData.email,
        targetUser.emailConfirmation.confirmationCode,
      )
      .catch((e) => {
        console.log('registration', e);
      });
  }

  async recoverPassword(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    this.emailManager
      .sendEmailForPasswordRecovery(email, user.passwordRecovery.recoveryCode)
      .catch((e) => {
        console.log('password recovery', e);
      });
  }

  async confirmPasswordRecovery(newPassword: string, recoveryCode: string) {
    const user =
      await this.usersRepository.findUserByRecoveryCode(recoveryCode);

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_INCORRECT,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.RECOVERY_CODE,
          APP_CONFIG.ERROR_MESSAGES.RECOVERY_CODE_IS_INCORRECT,
        ),
      );
    }

    const passHash = await this.bcryptAdapter.createHash(newPassword);

    user.confirmPasswordRecovery(passHash);

    await this.usersRepository.save(user);
  }

  async confirmRegistration(confirmationCode: string): Promise<void> {
    const user =
      await this.usersRepository.getUserByConfirmationCode(confirmationCode);

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.CONFIRMATION_CODE,
          APP_CONFIG.ERROR_MESSAGES.CONFIRMATION_CODE_INCORRECT,
        ),
      );
    }

    user.confirmRegistration();

    await this.usersRepository.save(user);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new ErrorWithStatusCode(
        APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatuses.BadRequest,
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.EMAIL,
          APP_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND,
        ),
      );
    }

    user.updateEmailConfirmationCode();

    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.getUserByLoginOrEmail(email);

    this.emailManager
      .sendEmailForRegistration(
        email,
        updatedUser.emailConfirmation.confirmationCode,
      )
      .catch((e) => console.log(e));
  }
}
