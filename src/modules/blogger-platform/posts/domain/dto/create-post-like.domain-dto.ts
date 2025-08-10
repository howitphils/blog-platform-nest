import { LikeStatuses } from '../../../../../core/enums/like-statuses';

export class CreatePostLikeDomainDto {
  status: LikeStatuses;
  userId: string;
  userLogin: string;
  postId: string;
}
