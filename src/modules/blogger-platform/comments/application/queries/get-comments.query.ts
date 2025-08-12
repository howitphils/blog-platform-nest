import { PostsQueryRepository } from './../../../posts/infrastructure/posts-query.repository';
import { CommentsQueryRepository } from './../../infrastructure/comments.query-repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from './dto/comment.view-dto';
import { PaginatedViewModel } from '../../../../../core/dto/pagination-view.base';
import { GetCommentsDto } from '../../infrastructure/dto/get-comments.dto';

export class GetCommentsQuery {
  constructor(public dto: GetCommentsDto) {}
}

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({
    dto,
  }: GetCommentsQuery): Promise<PaginatedViewModel<CommentViewDto>> {
    await this.postsQueryRepository.getPostByIdOrFail({
      postId: dto.postId,
      user: null,
    });

    return this.commentsQueryRepository.getAllCommentsForPost({
      query: dto.query,
      postId: dto.postId,
      user: dto.user,
    });
  }
}
