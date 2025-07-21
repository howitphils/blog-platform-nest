import { UserDbDocument } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  email: string;
  login: string;
  createdAt: Date;

  static mapToView(user: UserDbDocument): UserViewDto {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
