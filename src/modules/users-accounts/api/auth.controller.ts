import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { appConfig } from 'src/app.config';
import { ConfirmRegistrationInputDto } from './input-dto/confirm-registration.input-dto';
import { EmailConfirmationCodeResending } from './input-dto/email-confirmation-code-resending.input-dto';

@Controller(appConfig.MAIN_PATHS.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Post(appConfig.ENDPOINT_PATHS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: EmailConfirmationCodeResending) {
    return this.authService.resendConfirmationCode(dto.email);
  }
}
