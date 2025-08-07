import { UserDbDocument } from '../../../domain/user.entity';

export class MyInfoViewDto {
  email: string;
  login: string;
  userId: string;

  static mapToView(user: UserDbDocument): MyInfoViewDto {
    return {
      userId: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
    };
  }
}
