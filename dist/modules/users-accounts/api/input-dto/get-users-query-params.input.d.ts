import { BaseQueryParams } from '../../../../core/dto/base.query-params';
export declare enum UsersSortByOptions {
    CreatedAt = "createdAt",
    Login = "login",
    Email = "email"
}
export declare class GetUsersQueryParams extends BaseQueryParams {
    sortBy: UsersSortByOptions;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}
