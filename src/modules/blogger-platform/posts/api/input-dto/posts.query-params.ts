import { BaseQueryParams } from 'src/core/dto/query-params.base';

enum PostsSortByOptions {
  CreatedAt = 'createdAt',
}

export class PostsQueryParams extends BaseQueryParams {
  sortBy: PostsSortByOptions = PostsSortByOptions.CreatedAt;
}
