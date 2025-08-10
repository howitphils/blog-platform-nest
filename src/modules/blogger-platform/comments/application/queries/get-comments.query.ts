import { CommentsQueryRepository } from './../../infrastructure/comments.query-repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from './dto/comment.view-dto';
import { PaginatedViewModel } from '../../../../../core/dto/pagination-view.base';
import { GetCommentsDto } from './dto/get-comments.dto';

export class GetCommentsQuery {
  constructor(public dto: GetCommentsDto) {}
}

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({
    dto,
  }: GetCommentsQuery): Promise<PaginatedViewModel<CommentViewDto>> {
    return this.commentsQueryRepository.getAllCommentsForPost(
      dto.query,
      dto.postId,
      dto.userId,
    );
  }
}
