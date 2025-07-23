import { BaseQueryParams } from 'src/core/dto/base.query-params';

enum SortByBlogsOptions {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class BlogsQueryParams extends BaseQueryParams {
  sortBy: SortByBlogsOptions = SortByBlogsOptions.CreatedAt;
  searchNameTerm: string | null;
}
