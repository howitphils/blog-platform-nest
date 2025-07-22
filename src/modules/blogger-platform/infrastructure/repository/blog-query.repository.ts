import { BlogModelType } from '../../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blog.entity';
import { BlogView } from '../../api/view-dto/blog-view.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getBlogById(id: string): Promise<BlogView> {
    const blog = await this.BlogModel.findById(id);

    if (!blog) {
      throw new Error('Blog was not found');
    }

    return BlogView.mapToView(blog);
  }

  async getBlogs() {}
}
