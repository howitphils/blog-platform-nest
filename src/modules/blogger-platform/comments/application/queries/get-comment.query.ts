import { CommentsQueryRepository } from './../../infrastructure/comments.query-repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from './dto/comment.view-dto';

export class GetCommentQuery {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetCommentQuery)
export class GetCommentHandler implements IQueryHandler<GetCommentQuery> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(dto: GetCommentQuery): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getCommentById(
      dto.commentId,
      dto.userId,
    );
  }
}
