import { NewestLikeViewDto } from '../../application/query/dto/newest-like.view-dto';
import { LikeStatuses } from '../../../../../core/enums/like-statuses';
import { PostDbDocument } from '../../domain/session.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
    newestLikes: NewestLikeViewDto[];
  };

  static mapToView(dto: PostDbDocument, likeStatus: LikeStatuses): PostViewDto {
    const newPost = new PostViewDto();

    newPost.id = dto._id.toString();
    newPost.blogId = dto.blogId;
    newPost.blogName = dto.blogName;
    newPost.content = dto.content;
    newPost.createdAt = dto.createdAt;
    newPost.shortDescription = dto.shortDescription;
    newPost.title = dto.title;
    newPost.extendedLikesInfo = {
      likesCount: dto.likesCount,
      dislikesCount: dto.dislikesCount,
      myStatus: likeStatus,
      newestLikes: dto.newestLikes.map((like) =>
        NewestLikeViewDto.mapToView(like),
      ),
    };

    return newPost;
  }
}
