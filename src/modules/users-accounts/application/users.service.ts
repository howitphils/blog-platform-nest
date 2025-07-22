import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptService } from '../infrastructure/adapters/bcrypt.adapter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const passwordHash = await this.bcryptService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
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
