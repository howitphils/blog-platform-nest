import { User, UserSchema } from './domain/user.entity';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.respository';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordService } from './application/services/password.service';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { EmailSendingService } from './application/services/email-sending.service';
import { appConfig } from '../../app.config';
import { LoginUserUseHandler } from './application/use-cases/login.use-case';
import { UserFactory } from './application/factories/users.factory';
import { RegisterUserCommand } from './application/use-cases/register.use-case';

const useCases = [LoginUserUseHandler, RegisterUserCommand];

@Module({
  imports: [
    // Это позволит инжектировать UserModel в провайдеры в данном модуле
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    PasswordService,
    AuthService,
    JwtStrategy,
    EmailSendingService,
    UserFactory,
    ...useCases,
    {
      provide: appConfig.ACCESS_TOKEN_SERVICE,
      useFactory: (): JwtService => {
        return new JwtService({
          privateKey: appConfig.ACCESS_JWT_SECRET,
          signOptions: { expiresIn: appConfig.ACCESS_TOKEN_EXPIRES_IN },
        });
      },
    },
    {
      provide: appConfig.REFRESH_TOKEN_SERVICE,
      useFactory: (): JwtService => {
        return new JwtService({
          privateKey: appConfig.REFRESH_JWT_SECRET,
          signOptions: { expiresIn: appConfig.REFRESH_TOKEN_EXPIRES_IN },
        });
      },
    },
  ],
  exports: [JwtStrategy],
})
export class UsersAccountsModule {}
