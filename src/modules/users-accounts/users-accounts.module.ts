import { User, UserSchema } from './domain/user.entity';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.respository';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptService } from './infrastructure/adapters/bcrypt.adapter';
import { UsersQueryRepository } from './infrastructure/users-query.repository';

@Module({
  imports: [
    // Это позволит инжектировать UserModel в провайдеры в данном модуле
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    BcryptService,
  ],
  exports: [],
})
export class UsersAccountsModule {}
