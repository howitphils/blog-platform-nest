import { BaseQueryParams } from '../../../../core/dto/base.query-params';

export enum UsersSortByOptions {
  CreatedAt = 'createdAt',
}

export class GetUsersQueryParams extends BaseQueryParams {
  sortBy: UsersSortByOptions.CreatedAt;
  searchLoginTerm: string;
  searchEmailTerm: string;
}
