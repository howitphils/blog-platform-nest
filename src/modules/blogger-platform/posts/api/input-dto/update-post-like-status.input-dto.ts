import { IsEnum } from 'class-validator';
import { LikeStatuses } from '../../../../../core/enums/like-statuses';

export class UpdatePostLikeStatusInputDto {
  @IsEnum(LikeStatuses)
  likeStatus: LikeStatuses;
}
