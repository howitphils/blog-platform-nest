import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.respository';
import { UsersService } from './application/users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [],
})
export class UsersAccountModule {}
