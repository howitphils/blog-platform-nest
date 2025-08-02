import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/query-params.base';

export enum UsersSortByOptions {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetUsersQueryParams extends BaseQueryParams {
  @IsEnum(UsersSortByOptions)
  sortBy: UsersSortByOptions = UsersSortByOptions.CreatedAt;

  @IsString()
  @IsOptional()
  searchLoginTerm: string | null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null;
}
