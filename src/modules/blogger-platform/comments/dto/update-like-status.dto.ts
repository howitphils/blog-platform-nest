import { LikeStatuses } from '../../../../core/enums/like-statuses';

export class UpdateCommentsLikeStatusDto {
  likeStatus: LikeStatuses;
  userId: string;
  commentId: string;
}
