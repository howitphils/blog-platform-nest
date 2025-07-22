import { BlogDbDocument } from '../../domain/blog.entity';

export class BlogView {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  static mapToView(blog: BlogDbDocument): BlogView {
    return {
      id: blog._id.toString(),
      description: blog.description,
      isMembership: blog.isMembership,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    };
  }
}
