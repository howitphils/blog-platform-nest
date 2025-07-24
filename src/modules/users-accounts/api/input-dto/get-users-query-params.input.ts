import { BaseQueryParams } from '../../../../core/dto/base.query-params';

export enum UsersSortByOptions {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetUsersQueryParams extends BaseQueryParams {
  sortBy: UsersSortByOptions = UsersSortByOptions.CreatedAt;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}
