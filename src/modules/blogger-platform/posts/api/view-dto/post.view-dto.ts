import { PostDbDocument } from '../../domain/post.entity';

export class PostView {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;

  static mapToView(dto: PostDbDocument): PostView {
    return {
      id: dto._id.toString(),
      blogId: dto.blogId,
      blogName: dto.blogName,
      content: dto.content,
      createdAt: dto.createdAt,
      shortDescription: dto.shortDescription,
      title: dto.title,
    };
  }
}
