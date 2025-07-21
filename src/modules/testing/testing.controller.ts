import { InjectModel } from '@nestjs/mongoose';
import { Controller, Delete } from '@nestjs/common';
import { User, UserModelType } from '../users-accounts/domain/user.entity';

@Controller('testing')
export class TestingAllDataController {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  @Delete('all-data')
  async removeAllData() {
    await this.UserModel.deleteMany({});
  }
}
