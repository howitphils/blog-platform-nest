import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getUserById(id: string): Promise<UserDbDocument> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  async save(user: UserDbDocument): Promise<string> {
    const result = await user.save();
    return result._id.toString();
  }
}
