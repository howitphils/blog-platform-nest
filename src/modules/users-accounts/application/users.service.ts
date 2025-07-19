import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptService } from '../infrastructure/adapters/bcrypt.adapter';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async getUsers() {
    return this.usersQueryRepository.getUsers();
  }

  async createUser(dto: CreateUserDto) {
    const passwordHash = await this.bcryptService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash,
    });

    await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.getUserById(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
