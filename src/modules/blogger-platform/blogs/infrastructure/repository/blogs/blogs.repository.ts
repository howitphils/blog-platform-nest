import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDbDocument,
  BlogModelType,
} from '../../../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(blog: BlogDbDocument): Promise<string> {
    const result = await blog.save();
    return result._id.toString();
  }

  async getById(id: string): Promise<BlogDbDocument> {
    const targetBlog = await this.BlogModel.findById(id);

    if (!targetBlog) {
      throw new NotFoundException('Blog not found');
    }

    return targetBlog;
  }
}
