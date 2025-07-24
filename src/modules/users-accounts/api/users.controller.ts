import { UsersQueryRepository } from './../infrastructure/users-query.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input';
import { HttpStatusCodes } from 'src/core/eums/http-status-codes';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: GetUsersQueryParams) {
    return this.usersQueryRepository.getUsers(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto) {
    const createdId = await this.usersService.createUser({
      email: body.email,
      login: body.login,
      password: body.password,
    });

    const user = await this.usersQueryRepository.getUserById(createdId);

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatusCodes.No_Content)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
