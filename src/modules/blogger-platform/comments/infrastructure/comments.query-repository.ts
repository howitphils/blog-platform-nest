import { CommentModelType } from './../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { CommentsQueryParams } from '../api/input-dto/get-comments.query-params';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { CommentViewDto } from '../application/queries/dto/comment.view-dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { LikeStatuses } from '../../../../core/enums/like-statuses';

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  // Получение всех комментариев с учетом query параметров
  async getAllCommentsForPost(
    query: CommentsQueryParams,
    postId: string,
    userId: string | undefined,
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
    let likesObj: LikesStatusesObjType = {};

    if (userId) {
      const commentsIds = comments.map((comment) => comment._id.toString());

      // Получаем лайки для всех комментариев юзера
      const likes = await this.CommentLikeModel.find({
        commentId: { $in: commentsIds },
        userId,
      }).lean();

      likesObj = likes.reduce((acc: LikesStatusesObjType, like) => {
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
        return {
          commentatorInfo: comment.commentatorInfo,
          content: comment.content,
          createdAt: comment.createdAt,
          id: comment.id,
          likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: likesObj[comment.id] || LikeStatuses.None,
          },
        };
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

    let userLike: CommentLikeDbDocumentType | null = null;

    if (userId !== '') {
      userLike = await CommentLikeModel.findOne({ commentId, userId });
    }

    return CommentViewDto.mapToView(targetComment, LikeStatuses.None);
  }
}
