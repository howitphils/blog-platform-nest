import { CommentLikeModelType } from './../../domain/comment-like.entity';
import { CommentsLikesRepository } from './../../infrastructure/comments-likes.repository';
import { CommentsRepository } from './../../infrastructure/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLike } from '../../domain/comment-like.entity';
import { LikeStatuses } from '../../../../../core/enums/like-statuses';
import { UpdateCommentsLikeStatusDto } from './dto/update-like-status.dto';

export class UpdateCommentsLikeStatusCommand {
  constructor(public dto: UpdateCommentsLikeStatusDto) {}
}

@CommandHandler(UpdateCommentsLikeStatusCommand)
export class UpdateCommentsLikeStatusHandler
  implements ICommandHandler<UpdateCommentsLikeStatusCommand>
{
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
    private commentsRepository: CommentsRepository,
    private commentLikesRepository: CommentsLikesRepository,
  ) {}

  async execute({ dto }: UpdateCommentsLikeStatusCommand): Promise<void> {
    const targetComment = await this.commentsRepository.getCommentByIdOrFail(
      dto.commentId,
    );

    const targetLike =
      await this.commentLikesRepository.getLikeByUserIdAndCommentId({
        userId: dto.userId,
        commentId: dto.commentId,
      });

    if (!targetLike) {
      const newLike = this.CommentLikeModel.createCommentLike({
        commentId: dto.commentId,
        status: dto.likeStatus,
        userId: dto.userId,
      });

      await this.commentLikesRepository.save(newLike);

      if (dto.likeStatus === LikeStatuses.Like) {
        targetComment.updateLikeOrDislikeCount('likesCount', 'increase');
      } else if (dto.likeStatus === LikeStatuses.Dislike) {
        targetComment.updateLikeOrDislikeCount('dislikesCount', 'increase');
      }

      await this.commentsRepository.save(targetComment);

      return;
    }

    // Если статус лайка не равен статусу лайка в запросе, то обновляем счетчики лайков и дизлайков
    if (dto.likeStatus !== targetLike.status) {
      // Если статус лайка в запросе - None, то убираем лайк или дизлайк
      if (dto.likeStatus === LikeStatuses.None) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.updateLikeOrDislikeCount('likesCount', 'decrease');
        } else if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.updateLikeOrDislikeCount('dislikesCount', 'decrease');
        }
      }

      // Если в запросе - лайк
      if (dto.likeStatus === LikeStatuses.Like) {
        if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.updateLikeOrDislikeCount('dislikesCount', 'decrease');
        }
        // Если текущий статус лайка - None, то просто добавляем лайк
        targetComment.updateLikeOrDislikeCount('likesCount', 'increase');
      }

      // Если в запросе - дизлайк
      if (dto.likeStatus === LikeStatuses.Dislike) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.updateLikeOrDislikeCount('likesCount', 'decrease');
        }
        // Если текущий статус лайка - None, то просто добавляем дизлайк
        targetComment.updateLikeOrDislikeCount('dislikesCount', 'increase');
      }

      // если статус лайка отличается от текущего, обновляем его
      targetLike.updateStatus(dto.likeStatus);

      await Promise.all([
        this.commentLikesRepository.save(targetLike),
        this.commentsRepository.save(targetComment),
      ]);
    }
  }
}
