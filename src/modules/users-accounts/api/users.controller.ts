import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query() query: any) {
    return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {}

  @Delete(':id')
  deleteUser(@Param('id') id: string) {}
}
