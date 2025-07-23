import { BaseQueryParams } from 'src/core/dto/base.query-params';
declare enum PostsSortByOptions {
    CreatedAt = "createdAt"
}
export declare class PostsQueryParams extends BaseQueryParams {
    sortBy: PostsSortByOptions;
}
export {};
