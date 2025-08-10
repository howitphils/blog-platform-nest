import { CommentsRepository } from './../../infrastructure/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception.codes';
import { UpdateCommentDto } from '../../dto/update-comment.dto';

export class UpdateCommentCommand {
  constructor(public dto: UpdateCommentDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: UpdateCommentCommand): Promise<void> {
    const targetComment = await this.commentsRepository.getCommentByIdOrFail(
      dto.commentId,
    );

    if (dto.userId !== targetComment.userId) {
      throw new DomainException(
        'Forbidden action',
        DomainExceptionCodes.Forbidden,
      );
    }

    targetComment.updateComment({ content: dto.content });

    await this.commentsRepository.save(targetComment);
  }
}
