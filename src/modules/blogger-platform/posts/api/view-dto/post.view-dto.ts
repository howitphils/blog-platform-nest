import { PostDbDocument } from '../../domain/post.entity';

enum LikeStatuses {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export class PostView {
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
    myStatus: LikeStatuses; // Заменить на enum
    newestLikes: [];
  };

  static mapToView(dto: PostDbDocument): PostView {
    return {
      id: dto._id.toString(),
      blogId: dto.blogId,
      blogName: dto.blogName,
      content: dto.content,
      createdAt: dto.createdAt,
      shortDescription: dto.shortDescription,
      title: dto.title,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatuses.None,
        newestLikes: [],
      },
    };
  }
}
