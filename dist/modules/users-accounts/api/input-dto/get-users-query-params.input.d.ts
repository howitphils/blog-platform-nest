import { BaseQueryParams } from '../../../../core/dto/base.query-params';
export declare enum UsersSortByOptions {
    CreatedAt = "createdAt"
}
export declare class GetUsersQueryParams extends BaseQueryParams {
    sortBy: UsersSortByOptions.CreatedAt;
    searchLoginTerm: string;
    searchEmailTerm: string;
}
