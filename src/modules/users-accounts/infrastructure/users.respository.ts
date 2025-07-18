import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getUsers() {
    return this.UserModel.find({});
  }

  async save(user: UserDbDocument): Promise<UserDbDocument> {
    const result = await user.save();
    return result;
  }
}
