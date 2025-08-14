import { PostLikeDbDocument } from '../../../domain/post-like.entity';

export class NewestLikeViewDto {
  addedAt: string;
  userId: string;
  login: string;

  static mapToView(like: PostLikeDbDocument): NewestLikeViewDto {
    const newLike = new NewestLikeViewDto();

    newLike.addedAt = like.createdAt;
    newLike.userId = like.userId;
    newLike.login = like.userLogin;

    return newLike;
  }
}
