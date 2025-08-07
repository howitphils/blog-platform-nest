import { LikeStatuses } from '../../../../../../core/enums/like-statuses';
import { CommentDbDocument } from '../../../domain/comment.entity';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
  };

  static mapToView(
    dto: CommentDbDocument,
    likeStatus: LikeStatuses,
  ): CommentViewDto {
    return {
      id: dto._id.toString(),
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: dto.userLogin,
      },
      createdAt: dto.createdAt,
      likesInfo: {
        likesCount: dto.likesCount,
        dislikesCount: dto.dislikesCount,
        myStatus: likeStatus,
      },
    };
  }
}
