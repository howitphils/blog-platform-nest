import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptAdapter } from '../infrastructure/adapters/bcrypt.adapter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptAdapter,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    // TODO: Unique check

    const passwordHash = await this.bcryptService.generateHash(dto.password);

    const user = this.UserModel.createUser({
      email: dto.email,
      login: dto.login,
      passwordHash,
    });

    const createdId = await this.usersRepository.save(user);

    return createdId;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.getUserById(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
