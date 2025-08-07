import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/query-params.base';

enum CommentsSortByOptions {
  CreatedAt = 'createdAt',
}

export class CommentsQueryParams extends BaseQueryParams {
  @IsEnum(CommentsSortByOptions)
  sortBy: CommentsSortByOptions = CommentsSortByOptions.CreatedAt;
}
