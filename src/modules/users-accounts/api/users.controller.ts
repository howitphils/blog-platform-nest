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
import { appSettings } from '../../../app.settings';
import { IsValidObjectId } from '../../../core/decorators/validation/object-id.validator';
import { GetUsersQuery } from '../application/queries/get-users.query';
import { PaginatedViewModel } from '../../../core/dto/pagination-view.base';
import { UserViewDto } from '../application/queries/dto/user.view-dto';
import { CreateUserCommand } from '../application/use-cases/admin/create-user.use-case';
import { GetUserQuery } from '../application/queries/get-user.query';
import { DeleteUserCommand } from '../application/use-cases/admin/delete-user.use-case';

@Controller(appSettings.MAIN_PATHS.USERS)
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
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
    const createdId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand({
        email: body.email,
        login: body.login,
        password: body.password,
      }),
    );

    return this.queryBus.execute<GetUserQuery, UserViewDto>(
      new GetUserQuery(createdId),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', IsValidObjectId) id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return;
  }
}
