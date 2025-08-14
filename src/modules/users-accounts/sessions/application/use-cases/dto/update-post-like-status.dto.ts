import { LikeStatuses } from '../../../../../../core/enums/like-statuses';

export class UpdatePostLikeStatusDto {
  likeStatus: LikeStatuses;
  postId: string;
  userId: string;
}
