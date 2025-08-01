import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { appConfig } from 'src/app.config';

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
}
