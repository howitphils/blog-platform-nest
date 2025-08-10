import { PostsRepository } from './../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatuses } from '../../../../../core/enums/like-statuses';
import { CommentLike } from '../../../comments/domain/comment-like.entity';

import { PostsLikesRepository } from '../../infrastructure/posts-like.query-repository';
import { PostLikeModelType } from '../../domain/post-like.entity';
import { UsersExternalRepository } from '../../../../users-accounts/infrastructure/users.external-repository';
import { UpdatePostLikeStatusDto } from './dto/update-post-like-status.dto';

export class UpdatePostLikeStatusCommand {
  constructor(public dto: UpdatePostLikeStatusDto) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostsLikeStatusHandler
  implements ICommandHandler<UpdatePostLikeStatusCommand>
{
  constructor(
    @InjectModel(CommentLike.name)
    private PostLikeModel: PostLikeModelType,
    private postsRepository: PostsRepository,
    private postsLikesRepository: PostsLikesRepository,
    private usersExternalRepository: UsersExternalRepository,
  ) {}

  async execute({ dto }: UpdatePostLikeStatusCommand): Promise<void> {
    const targetPost = await this.postsRepository.getPostByIdOrFail(dto.postId);

    const targetLike =
      await this.postsLikesRepository.getPostLikeByUserIdAndPostId({
        userId: dto.userId,
        postId: dto.postId,
      });

    if (!targetLike) {
      const user = await this.usersExternalRepository.getUserByIdOrFail(
        dto.userId,
      );

      const newLike = this.PostLikeModel.createLike({
        postId: dto.postId,
        status: dto.likeStatus,
        userId: dto.userId,
        userLogin: user.accountData.login,
      });

      await this.postsLikesRepository.save(newLike);

      if (dto.likeStatus === LikeStatuses.Like) {
        targetPost.updateLikeOrDislikeCount('likesCount', 'increase');
      } else if (dto.likeStatus === LikeStatuses.Dislike) {
        targetPost.updateLikeOrDislikeCount('dislikesCount', 'increase');
      }

      await this.postsRepository.save(targetPost);

      return;
    }

    // Если статус лайка не равен статусу лайка в запросе, то обновляем счетчики лайков и дизлайков
    if (dto.likeStatus !== targetLike.status) {
      // Если статус лайка в запросе - None, то убираем лайк или дизлайк
      if (dto.likeStatus === LikeStatuses.None) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetPost.updateLikeOrDislikeCount('likesCount', 'decrease');
        } else if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetPost.updateLikeOrDislikeCount('dislikesCount', 'decrease');
        }
      }

      // Если в запросе - лайк
      if (dto.likeStatus === LikeStatuses.Like) {
        if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetPost.updateLikeOrDislikeCount('dislikesCount', 'decrease');
        }
        // Если текущий статус лайка - None, то просто добавляем лайк
        targetPost.updateLikeOrDislikeCount('likesCount', 'increase');
      }

      // Если в запросе - дизлайк
      if (dto.likeStatus === LikeStatuses.Dislike) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetPost.updateLikeOrDislikeCount('likesCount', 'decrease');
        }
        // Если текущий статус лайка - None, то просто добавляем дизлайк
        targetPost.updateLikeOrDislikeCount('dislikesCount', 'increase');
      }

      targetLike.updateStatus(dto.likeStatus);

      await this.postsLikesRepository.save(targetLike);

      const newestLikes = await this.postsLikesRepository.getNewestLikes(
        targetPost._id.toString(),
      );

      targetPost.updateNewestLikes(newestLikes);

      await this.postsRepository.save(targetPost);
    }
  }
}
