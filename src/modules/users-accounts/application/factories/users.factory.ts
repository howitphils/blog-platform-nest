import { UsersRepository } from './../../infrastructure/users.respository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../../core/exceptions/errorsMessages';
import { PasswordService } from '../services/password.service';

@Injectable()
export class UserFactory {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async create(dto: CreateUserDto) {
    await this.checkExisting(dto);
    const passwordHash = await this.createHash(dto);

    const user = this.UserModel.createUser({
      email: dto.email,
      login: dto.login,
      passwordHash,
    });

    return user;
  }

  private async checkExisting(dto: CreateUserDto) {
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
  }

  private async createHash(dto: CreateUserDto) {
    return this.passwordService.generateHash(dto.password);
  }
}
