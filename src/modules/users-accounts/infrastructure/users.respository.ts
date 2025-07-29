import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async save(user: UserDbDocument): Promise<string> {
    const result = await user.save();
    return result._id.toString();
  }

  async getUserById(id: string): Promise<UserDbDocument> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return user;
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbDocument> {
    const user = await this.UserModel.findOne({
      $or: [
        { email: { $regex: loginOrEmail, $options: 'i' } },
        { login: { $regex: loginOrEmail, $options: 'i' } },
      ],
    });

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return user;
  }

  async getUserByCredentials(
    login: string,
    email: string,
  ): Promise<UserDbDocument | null> {
    return this.UserModel.findOne({
      $or: [
        { email: { $regex: email, $options: 'i' } },
        { login: { $regex: login, $options: 'i' } },
      ],
    });
  }

  async getUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDbDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
    });
  }

  async findUserByRecoveryCode(code: string): Promise<UserDbDocument | null> {
    return this.UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }
}
