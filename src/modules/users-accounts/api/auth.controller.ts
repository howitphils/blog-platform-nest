import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Req,
  Ip,
} from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { ConfirmRegistrationInputDto } from './input-dto/confirm-registration.input-dto';
import { EmailConfirmationCodeResending } from './input-dto/email-confirmation-code-resending.input-dto';
import { LoginUserInputDto } from './input-dto/login-user.input-dto';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { ConfirmPasswordRecoveryInputDto } from './input-dto/confirm-password-recovery.input-dto';
import { Request, Response } from 'express';
import { LoginUserCommand } from '../application/use-cases/login.use-case';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenPair } from '../dto/token-pair.dto';
import { RegisterUserCommand } from '../application/use-cases/register.use-case';
import { ConfirmRegistrationCommand } from '../application/use-cases/confirm-registration.use-case';
import { ResendEmailConfirmatoinCommand } from '../application/use-cases/email-confirmation-resending.use-case';
import { RecoverPasswordCommand } from '../application/use-cases/password-recovery.use-case';
import { ConfirmPasswordRecoveryCommand } from '../application/use-cases/confirm-password-recovery.use-case';
import { GetMyInfoQuery } from '../application/queries/get-my-info.query';
import { MyInfoViewDto } from '../application/queries/dto/my-info.veiw-dto';
import { appSettings } from '../../../app.settings';
import { CookieTTL } from '../../../core/enums/cookie-ttl';
import { JwtAccessAuthGuard } from '../guards/bearer/jwt-access-token.auth-guard';
import { UserAccountsConfig } from '../user-accounts.config';
import { JwtRefreshAuthGuard } from '../guards/bearer/jwt-refresh-token.auth-guard';
import { RefreshTokensCommand } from '../application/use-cases/refresh-tokens.use-case';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller(appSettings.MAIN_PATHS.AUTH)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private userAccountsConfig: UserAccountsConfig,
  ) {}

  @Post(appSettings.ENDPOINT_PATHS.AUTH.LOGIN)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserInputDto,
  ) {
    const deviceName = req.headers['user-agent'] || 'default_device_name';

    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      TokenPair
    >(
      new LoginUserCommand({
        loginOrEmail: dto.loginOrEmail,
        password: dto.password,
        deviceName,
        ip,
      }),
    );

    res.cookie(this.userAccountsConfig.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: CookieTTL.SEVEN_DAYS,
    });

    return { accessToken };
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN)
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: RequestWithRefreshUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshTokensCommand,
      TokenPair
    >(
      new RefreshTokensCommand({
        userId: req.user.id,
        deviceId: req.user.deviceId,
        iat: req.user.iat,
      }),
    );

    res.cookie(this.userAccountsConfig.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: CookieTTL.SEVEN_DAYS,
    });

    return { accessToken };
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.LOGOUT)
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: RequestWithRefreshUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(
      new LogoutCommand({
        userId: req.user.id,
        deviceId: req.user.deviceId,
        iat: req.user.iat,
      }),
    );

    // httpOnly, path, secure должны быть такими же как при создании
    res.clearCookie(this.userAccountsConfig.refreshTokenCookieName, {
      httpOnly: true,
      secure: true,
    });

    return;
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.REGISTRATION)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() dto: CreateUserInputDto) {
    await this.commandBus.execute(
      new RegisterUserCommand({
        login: dto.login,
        email: dto.email,
        password: dto.password,
      }),
    );

    return;
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.REGISTRATION_CONFIRMATION)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() dto: ConfirmRegistrationInputDto) {
    await this.commandBus.execute(new ConfirmRegistrationCommand(dto.code));
    return;
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.REGISTRATION_EMAIL_RESENDING)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmailConfirmationCode(
    @Body() dto: EmailConfirmationCodeResending,
  ) {
    await this.commandBus.execute(
      new ResendEmailConfirmatoinCommand(dto.email),
    );

    return;
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get(appSettings.ENDPOINT_PATHS.AUTH.ME)
  async getMyInfo(@Req() req: RequestWithAccessUser) {
    return this.queryBus.execute<GetMyInfoQuery, MyInfoViewDto>(
      new GetMyInfoQuery(req.user.id),
    );
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() dto: PasswordRecoveryInputDto) {
    await this.commandBus.execute(new RecoverPasswordCommand(dto.email));
    return;
  }

  @Post(appSettings.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordRecovery(@Body() dto: ConfirmPasswordRecoveryInputDto) {
    await this.commandBus.execute(
      new ConfirmPasswordRecoveryCommand({
        newPassword: dto.newPassword,
        recoveryCode: dto.recoveryCode,
      }),
    );

    return;
  }
}
