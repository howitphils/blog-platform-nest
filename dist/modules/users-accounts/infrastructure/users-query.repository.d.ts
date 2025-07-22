import { UserModelType } from '../domain/user.entity';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input';
import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';
import { UserViewDto } from '../api/view-dto/user.view-dto';
export declare class UsersQueryRepository {
    private UserModel;
    constructor(UserModel: UserModelType);
    getUserById(id: string): Promise<UserViewDto>;
    getUsers(queryParams: GetUsersQueryParams): Promise<PaginatedViewModel<UserViewDto>>;
}
