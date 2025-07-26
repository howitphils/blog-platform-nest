import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input';
import { UserViewDto } from '../api/view-dto/user.view-dto';
import { PaginatedViewModel } from '../../../core/dto/pagination-view.base';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getUserById(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getUsers(
    queryParams: GetUsersQueryParams,
  ): Promise<PaginatedViewModel<UserViewDto>> {
    const {
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
    } = queryParams;

    const createFilter = () => {
      if (searchEmailTerm && searchLoginTerm) {
        return {
          $or: [
            {
              email: { $regex: searchEmailTerm, $options: 'i' },
            },
            {
              login: { $regex: searchLoginTerm, $options: 'i' },
            },
          ],
        };
      } else if (searchEmailTerm) {
        return { email: { $regex: searchEmailTerm, $options: 'i' } };
      } else if (searchLoginTerm) {
        return { login: { $regex: searchLoginTerm, $options: 'i' } };
      } else {
        return {};
      }
    };

    const users = await this.UserModel.find(createFilter())
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(queryParams.calculateSkip())
      .limit(pageSize);

    const totalCount = await this.UserModel.countDocuments(createFilter());

    return PaginatedViewModel.mapToView<UserViewDto>({
      totalCount,
      pageSize,
      page: pageNumber,
      items: users.map((user) => UserViewDto.mapToView(user)),
    });
  }
}
