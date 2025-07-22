import { BaseQueryParams } from 'src/core/dto/base.query-params';

enum PostsSortByOptions {
  CreatedAt = 'createdAt',
}

export class PostsQueryParams extends BaseQueryParams {
  sortBy: PostsSortByOptions.CreatedAt;
}
