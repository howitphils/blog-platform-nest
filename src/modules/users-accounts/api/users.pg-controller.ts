/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UsersPgRepository } from './../infrastructure/users.pg-repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input';

import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { appSettings } from '../../../app.settings';

@Controller(appSettings.MAIN_PATHS.SUPER_ADMIN)
@UseGuards(BasicAuthGuard)
export class UsersPgController {
  constructor(private usersPgRepository: UsersPgRepository) {}

  @Get()
  async getUsers(@Query() query: GetUsersQueryParams) {
    return this.usersPgRepository.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersPgRepository.getUser(id);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto) {
    return this.usersPgRepository.createUser({
      login: body.login,
      email: body.email,
      password: body.password,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    return this.usersPgRepository.deleteUser(id);
  }
}
