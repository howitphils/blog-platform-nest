import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { PasswordService } from './services/password.service';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';
import { ErrorsMessages } from 'src/core/exceptions/errorsMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const existingUser = await this.usersRepository.getUserByCredentials(
      dto.login,
      dto.email,
    );

    if (existingUser) {
      const field =
        existingUser.accountData.login === dto.login ? 'login' : 'email';

      throw new DomainException(
        'User with this login or email already exists',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance(
          field,
          `User with this ${field} already exists`,
        ),
      );
    }

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
    const user = await this.usersRepository.getUserByIdOrFail(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
