import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { appSettings } from '../../app.settings';
import { CoreConfig } from '../../core/core.config';
import { EmailSendingService } from '../notifications/services/email-sending.service';
import { JwtAccessStrategy } from './guards/bearer/jwt.access-strategy';
import { UserAccountsConfig } from './user-accounts.config';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';
import { AuthService } from './application/auth.service';
import { UserFactory } from './application/factories/users.factory';
import { GetMyInfoHandler } from './application/queries/get-my-info.query';
import { GetUserHandler } from './application/queries/get-user.query';
import { GetUsersHandler } from './application/queries/get-users.query';
import { PasswordService } from './application/services/password.service';
import { CreateUserHandler } from './application/use-cases/admin/create-user.use-case';
import { DeleteUserHandler } from './application/use-cases/admin/delete-user.use-case';
import { ConfirmPasswordRecoveryHandler } from './application/use-cases/confirm-password-recovery.use-case';
import { ConfirmRegistrationHandler } from './application/use-cases/confirm-registration.use-case';
import { ResendEmailConfirmatoinHandler } from './application/use-cases/email-confirmation-resending.use-case';
import { LoginUserUseHandler } from './application/use-cases/login.use-case';
import { RecoverPasswordHandler } from './application/use-cases/password-recovery.use-case';
import { RegisterUserHandler } from './application/use-cases/register.use-case';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/user.entity';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { UsersExternalRepository } from './infrastructure/users.external-repository';
import { UsersRepository } from './infrastructure/users.respository';
import { Module } from '@nestjs/common';
import { Session, SessionSchema } from './domain/session.entity';
import { SessionsRepository } from './infrastructure/sessions.repository';
import { JwtRefreshStrategy } from './guards/bearer/jwt.refresh-strategy';
import { DeleteSessionHandler } from './application/use-cases/sessions/delete-session.use-case';
import { DeleteAllSessionsHandler } from './application/use-cases/sessions/delete-all-sessions.use-case';
import { GetAllSessionsHandler } from './application/queries/get-all-sessions.query';
import { SessionsController } from './api/sessions.controller';
import { RefreshTokensHandler } from './application/use-cases/refresh-tokens.use-case';

const commandHandlers = [
  LoginUserUseHandler,
  RegisterUserHandler,
  ConfirmRegistrationHandler,
  ResendEmailConfirmatoinHandler,
  RecoverPasswordHandler,
  ConfirmPasswordRecoveryHandler,
  DeleteUserHandler,
  CreateUserHandler,
  DeleteSessionHandler,
  DeleteAllSessionsHandler,
  RefreshTokensHandler,
];

const queryHandlers = [
  GetMyInfoHandler,
  GetUsersHandler,
  GetUserHandler,
  GetAllSessionsHandler,
];

@Module({
  imports: [
    // Это позволит инжектировать UserModel в провайдеры в данном модуле
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    PassportModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController, SessionsController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersExternalRepository,
    UsersService,
    PasswordService,
    AuthService,
    EmailSendingService,
    UserFactory,
    UserAccountsConfig,
    CoreConfig,
    SessionsRepository,
    ...commandHandlers,
    ...queryHandlers,
    {
      provide: JwtAccessStrategy,
      useFactory: (coreConfig: CoreConfig) => {
        return new JwtAccessStrategy(coreConfig.jwtAccessSecret);
      },
      inject: [CoreConfig],
    },
    {
      provide: JwtRefreshStrategy,
      useFactory: (coreConfig: CoreConfig) => {
        return new JwtRefreshStrategy(coreConfig.jwtRefreshSecret);
      },
      inject: [CoreConfig],
    },
    {
      provide: appSettings.ACCESS_TOKEN_SERVICE,
      useFactory: (
        usersConfig: UserAccountsConfig,
        coreCofig: CoreConfig,
      ): JwtService => {
        return new JwtService({
          privateKey: coreCofig.jwtAccessSecret,
          signOptions: { expiresIn: usersConfig.accessTokenExp },
        });
      },
      inject: [UserAccountsConfig, CoreConfig],
    },
    {
      provide: appSettings.REFRESH_TOKEN_SERVICE,
      useFactory: (
        usersConfig: UserAccountsConfig,
        coreCofig: CoreConfig,
      ): JwtService => {
        return new JwtService({
          privateKey: coreCofig.jwtRefreshSecret,
          signOptions: { expiresIn: usersConfig.refreshTokenExp },
        });
      },
      inject: [UserAccountsConfig, CoreConfig],
    },
  ],
  exports: [UsersExternalRepository], // Попробовать убрать стратегию
})
export class UsersAccountsModule {}
