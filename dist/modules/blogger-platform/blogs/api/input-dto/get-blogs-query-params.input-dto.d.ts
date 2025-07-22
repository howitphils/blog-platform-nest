import { BaseQueryParams } from 'src/core/dto/base.query-params';
declare enum SortByBlogsOptions {
    CreatedAt = "createdAt",
    Name = "name"
}
export declare class BlogsQueryParams extends BaseQueryParams {
    sortBy: SortByBlogsOptions;
    searchNameTerm: string | null;
}
export {};
