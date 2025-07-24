import { BaseQueryParams } from 'src/core/dto/query-params.base';

enum SortByBlogsOptions {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class BlogsQueryParams extends BaseQueryParams {
  sortBy: SortByBlogsOptions = SortByBlogsOptions.CreatedAt;
  searchNameTerm: string | null;
}
