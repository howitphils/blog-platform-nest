import { CommentLikeModelType } from './../domain/comment-like.entity';
import { CommentModelType } from './../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { CommentViewDto } from '../application/queries/dto/comment.view-dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { LikeStatuses } from '../../../../core/enums/like-statuses';
import { CommentLike } from '../domain/comment-like.entity';
import { LikeStatusObj } from '../../../../core/dto/like-status-object';
import { Injectable } from '@nestjs/common';
import { GetCommentsDto } from './dto/get-comments.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    dto: GetCommentsDto,
  ): Promise<PaginatedViewModel<CommentViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto.query;

    // Получаем комментарии с учетом query параметров
    const comments = await this.CommentModel.find({ postId: dto.postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех комментов конкретного поста
    const totalCount = await this.CommentModel.countDocuments({
      postId: dto.postId,
    });

    // Объект структуры commentId: likeStatus
    let likesObj: LikeStatusObj = {};

    if (dto.user) {
      const commentsIds = comments.map((comment) => comment._id.toString());

      // Получаем лайки для всех комментариев юзера
      const likes = await this.CommentLikeModel.find({
        commentId: { $in: commentsIds },
        userId: dto.user.id,
      }).lean();

      likesObj = likes.reduce((acc: LikeStatusObj, like) => {
        acc[like.commentId] = like.status;
        return acc;
      }, {});
    }

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
      totalCount,
      items: comments.map((comment) => {
        const likeStatus =
          likesObj[comment._id.toString()] || LikeStatuses.None;

        return CommentViewDto.mapToView(comment, likeStatus);
      }),
    };
  }

  async getCommentById(
    commentId: string,
    userId: string | null,
  ): Promise<CommentViewDto> {
    const targetComment = await this.CommentModel.findById(commentId);

    if (!targetComment) {
      throw new DomainException(
        'Comment not found',
        DomainExceptionCodes.NotFound,
      );
    }

    let userLikeStatus: LikeStatuses = LikeStatuses.None;

    if (userId) {
      const userLike = await this.CommentLikeModel.findOne({
        commentId,
        userId,
      });

      if (userLike) {
        userLikeStatus = userLike.status;
      }
    }

    return CommentViewDto.mapToView(targetComment, userLikeStatus);
  }
}
