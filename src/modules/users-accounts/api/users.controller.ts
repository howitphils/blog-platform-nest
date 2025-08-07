import { UsersQueryRepository } from './../infrastructure/users-query.repository';
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
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { appConfig } from '../../../app.config';
import { IsValidObjectId } from '../../../core/decorators/validation/object-id.validator';

@Controller(appConfig.MAIN_PATHS.USERS)
@UseGuards(BasicAuthGuard)
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

    return this.usersQueryRepository.getUserById(createdId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', IsValidObjectId) id: string) {
    return this.usersService.deleteUser(id);
  }
}
