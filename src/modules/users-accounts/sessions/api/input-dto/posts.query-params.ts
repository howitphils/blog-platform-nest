import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/query-params.base';

enum PostsSortByOptions {
  CreatedAt = 'createdAt',
}

export class PostsQueryParams extends BaseQueryParams {
  @IsEnum(PostsSortByOptions)
  sortBy: PostsSortByOptions = PostsSortByOptions.CreatedAt;
}
