import {
  CommentLikeDbDocument,
  CommentLikeModelType,
} from './../domain/comment-like.entity';
import { CommentModelType } from './../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { CommentsQueryParams } from '../api/input-dto/get-comments.query-params';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { CommentViewDto } from '../application/queries/dto/comment.view-dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { LikeStatuses } from '../../../../core/enums/like-statuses';
import { CommentLike } from '../domain/comment-like.entity';
import { LikeStatusObj } from '../../../../core/dto/like-status-object';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    query: CommentsQueryParams,
    postId: string,
    userId?: string,
  ): Promise<PaginatedViewModel<CommentViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    // Получаем комментарии с учетом query параметров
    const comments = await this.CommentModel.find({ postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Получаем число всех комментов конкретного поста
    const totalCount = await this.CommentModel.countDocuments({ postId });

    // Объект структуры commentId: likeStatus
    let likesObj: LikeStatusObj = {};

    if (userId) {
      const commentsIds = comments.map((comment) => comment._id.toString());

      // Получаем лайки для всех комментариев юзера
      const likes = await this.CommentLikeModel.find({
        commentId: { $in: commentsIds },
        userId,
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
    userId: string,
  ): Promise<CommentViewDto> {
    const targetComment = await this.CommentModel.findById(commentId);

    if (!targetComment) {
      throw new DomainException(
        'Comment not found',
        DomainExceptionCodes.NotFound,
      );
    }

    let userLike: CommentLikeDbDocument | null = null;

    if (userId !== '') {
      userLike = await this.CommentLikeModel.findOne({ commentId, userId });
    }

    const likeStatus = userLike ? userLike.status : LikeStatuses.None;

    return CommentViewDto.mapToView(targetComment, likeStatus);
  }
}
