import { BaseQueryParams } from 'src/core/dto/query-params.base';
declare enum PostsSortByOptions {
    CreatedAt = "createdAt"
}
export declare class PostsQueryParams extends BaseQueryParams {
    sortBy: PostsSortByOptions;
}
export {};
