import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { ConfirmRegistrationInputDto } from './input-dto/confirm-registration.input-dto';
import { EmailConfirmationCodeResending } from './input-dto/email-confirmation-code-resending.input-dto';
import { LoginUserInputDto } from './input-dto/login-user.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { ConfirmPasswordRecoveryInputDto } from './input-dto/confirm-password-recovery.input-dto';
import { appConfig } from '../../../app.config';
import { Response } from 'express';
import { CookieTTL } from '../../../core/enums/cookie-ttl';
import { LoginUserCommand } from '../application/use-cases/login.use-case';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenPair } from '../dto/token-pair.dto';
import { RegisterUserCommand } from '../application/use-cases/register.use-case';
import { ConfirmRegistrationCommand } from '../application/use-cases/confirm-registration.use-case';
import { ResendEmailConfirmatoinCommand } from '../application/use-cases/email-confirmation-resending.use-case';
import { RecoverPasswordCommand } from '../application/use-cases/password-recovery.use-case';
import { ConfirmPasswordRecoveryCommand } from '../application/use-cases/confirm-password-recovery.use-case';
import { GetMyInfoQuery } from '../application/queries/get-my-info.query';
import { MyInfoViewDto } from './view-dto/my-info.veiw-dto';

@Controller(appConfig.MAIN_PATHS.AUTH)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post(appConfig.ENDPOINT_PATHS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserInputDto,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      TokenPair
    >(
      new LoginUserCommand({
        loginOrEmail: dto.loginOrEmail,
        password: dto.password,
      }),
    );

    res.cookie(appConfig.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/auth',
      maxAge: CookieTTL.SEVEN_DAYS,
    });

    return { accessToken };
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.REGISTRATION)
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

  @Post(appConfig.ENDPOINT_PATHS.AUTH.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() dto: ConfirmRegistrationInputDto) {
    await this.commandBus.execute(new ConfirmRegistrationCommand(dto.code));
    return;
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmailConfirmationCode(
    @Body() dto: EmailConfirmationCodeResending,
  ) {
    await this.commandBus.execute(
      new ResendEmailConfirmatoinCommand(dto.email),
    );

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get(appConfig.ENDPOINT_PATHS.AUTH.ME)
  async getMyInfo(@Request() req: RequestWithUser) {
    return this.queryBus.execute<GetMyInfoQuery, MyInfoViewDto>(
      new GetMyInfoQuery(req.user.id),
    );
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() dto: PasswordRecoveryInputDto) {
    await this.commandBus.execute(new RecoverPasswordCommand(dto.email));
    return;
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY)
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
