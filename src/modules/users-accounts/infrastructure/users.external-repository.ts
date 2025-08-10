import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';

@Injectable()
export class UsersExternalRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getUserByIdOrFail(id: string): Promise<UserDbDocument> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new DomainException(
        'User is not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return user;
  }
}
