import { UsersQueryRepository } from './../infrastructure/users-query.repository';
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
import { AuthService } from '../application/auth.service';
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

@Controller(appConfig.MAIN_PATHS.AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post(appConfig.ENDPOINT_PATHS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserInputDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.loginUser({
      loginOrEmail: dto.loginOrEmail,
      password: dto.password,
    });

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
    return this.authService.registerUser({
      login: dto.login,
      email: dto.email,
      password: dto.password,
    });
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() dto: ConfirmRegistrationInputDto) {
    return this.authService.confirmRegistration(dto.code);
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmailConfirmationCode(
    @Body() dto: EmailConfirmationCodeResending,
  ) {
    return this.authService.resendConfirmationCode(dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(appConfig.ENDPOINT_PATHS.AUTH.ME)
  @HttpCode(HttpStatus.OK)
  async getMyInfo(@Request() req: RequestWithUser) {
    return this.usersQueryRepository.getMyInfo(req.user.id);
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() dto: PasswordRecoveryInputDto) {
    return this.authService.recoverPassword(dto.email);
  }

  @Post(appConfig.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordRecovery(@Body() dto: ConfirmPasswordRecoveryInputDto) {
    return this.authService.confirmPasswordRecovery({
      newPassword: dto.newPassword,
      recoveryCode: dto.recoveryCode,
    });
  }
}
