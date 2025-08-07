import { IsEnum } from 'class-validator';
import { LikeStatuses } from '../../../../../core/enums/like-statuses';

export class UpdateCommentLikeStatusInputDto {
  @IsEnum(LikeStatuses)
  likeStatus: LikeStatuses;
}
