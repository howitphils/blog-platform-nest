import { User, UserSchema } from './domain/user.entity';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.respository';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptAdapter } from './infrastructure/adapters/bcrypt.adapter';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/app.config';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { NodemailerAdapter } from './infrastructure/adapters/nodemailer.adapter';

@Module({
  imports: [
    // Это позволит инжектировать UserModel в провайдеры в данном модуле
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      privateKey: appConfig.JWT_SECRET,
      signOptions: { expiresIn: appConfig.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    BcryptAdapter,
    AuthService,
    JwtStrategy,
    NodemailerAdapter,
  ],
  exports: [JwtStrategy],
})
export class UsersAccountsModule {}
