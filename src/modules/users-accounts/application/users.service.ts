import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async getUsers() {
    return this.usersRepository.getUsers();
  }

  async createUser(dto: CreateUserDto) {
    const user = this.UserModel.createInstance(dto);

    await this.usersRepository.save(user);
  }
}
