import { BaseQueryParams } from 'src/core/dto/query-params.base';
declare enum SortByBlogsOptions {
    CreatedAt = "createdAt",
    Name = "name"
}
export declare class BlogsQueryParams extends BaseQueryParams {
    sortBy: SortByBlogsOptions;
    searchNameTerm: string | null;
}
export {};
