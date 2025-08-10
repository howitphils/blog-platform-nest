import { CommentsRepository } from './../../infrastructure/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception.codes';
import { DeleteCommentDto } from '../../dto/delete-comment.dto';

export class DeleteCommentCommand {
  constructor(public dto: DeleteCommentDto) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: DeleteCommentCommand): Promise<void> {
    const targetComment = await this.commentsRepository.getCommentByIdOrFail(
      dto.commentId,
    );

    if (dto.userId !== targetComment.userId) {
      throw new DomainException(
        'Forbidden action',
        DomainExceptionCodes.Forbidden,
      );
    }

    targetComment.delete();

    await this.commentsRepository.save(targetComment);
  }
}
