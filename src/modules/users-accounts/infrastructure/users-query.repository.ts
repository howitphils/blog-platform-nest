import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input';
import { UserViewDto } from '../api/view-dto/user.view-dto';
import { PaginatedViewModel } from '../../../core/dto/pagination-view.base';
import { MyInfoViewDto } from '../api/view-dto/my-info.veiw-dto';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getUserByIdOrFail(id: string): Promise<UserViewDto> {
    const user = await this._getUserOrThrowError(id);

    return UserViewDto.mapToView(user);
  }

  async getMyInfoOrFail(id: string): Promise<MyInfoViewDto> {
    const user = await this._getUserOrThrowError(id);

    return MyInfoViewDto.mapToView(user);
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
              'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
            },
            {
              'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
            },
          ],
        };
      } else if (searchEmailTerm) {
        return {
          'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
        };
      } else if (searchLoginTerm) {
        return {
          'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
        };
      } else {
        return {};
      }
    };

    const users = await this.UserModel.find(createFilter())
      .sort({
        [`accountData.${sortBy}`]: sortDirection,
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

  private async _getUserOrThrowError(id: string): Promise<UserDbDocument> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new DomainException(
        'User not found',
        DomainExceptionCodes.BadRequest,
      );
    }

    return user;
  }
}
