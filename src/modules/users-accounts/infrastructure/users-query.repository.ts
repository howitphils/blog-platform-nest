import { Injectable, Session } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDbDocument, UserModelType } from '../domain/user.entity';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input';
import { UserViewDto } from '../application/queries/dto/user.view-dto';
import { PaginatedViewModel } from '../../../core/dto/pagination-view.base';
import { MyInfoViewDto } from '../application/queries/dto/my-info.veiw-dto';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';
import { SessionViewDto } from '../application/queries/dto/session.view-dto';
import { SessionModelType } from '../domain/session.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async getUserByIdOrFail(id: string): Promise<UserViewDto> {
    const user = await this.getUserOrThrowError(id);

    return UserViewDto.mapToView(user);
  }

  async getMyInfoOrFail(id: string): Promise<MyInfoViewDto> {
    const user = await this.getUserOrThrowError(id);

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

  async getAllUsersSessions(userId: string): Promise<SessionViewDto[]> {
    await this.getUserByIdOrFail(userId);

    const sessions = await this.SessionModel.find({ userId });

    return sessions.map((session) => SessionViewDto.mapToView(session));
  }

  private async getUserOrThrowError(id: string): Promise<UserDbDocument> {
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
