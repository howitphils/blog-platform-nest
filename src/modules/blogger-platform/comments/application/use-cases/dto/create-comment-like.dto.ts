import { LikeStatuses } from '../../../../../../core/enums/like-statuses';

export class CreateCommentLikeDto {
  status: LikeStatuses;
  userId: string;
  commentId: string;
}
