import { QueryBus, CommandBus } from '@nestjs/cqrs';
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
import { appConfig } from '../../../app.config';
import { IsValidObjectId } from '../../../core/decorators/validation/object-id.validator';
import { GetUsersQuery } from '../application/queries/get-users.query';
import { PaginatedViewModel } from '../../../core/dto/pagination-view.base';
import { UserViewDto } from '../application/queries/dto/user.view-dto';

@Controller(appConfig.MAIN_PATHS.USERS)
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private queryBus: QueryBus,
    private CommandBus: CommandBus,
  ) {}

  @Get()
  async getUsers(@Query() query: GetUsersQueryParams) {
    return this.queryBus.execute<
      GetUsersQuery,
      PaginatedViewModel<UserViewDto>
    >(new GetUsersQuery(query));
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto) {
    const createdId = await this.usersService.createUser({
      email: body.email,
      login: body.login,
      password: body.password,
    });

    return this.usersQueryRepository.getUserByIdOrFail(createdId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', IsValidObjectId) id: string) {
    return this.usersService.deleteUser(id);
  }
}
