import { BlogDbDocument } from '../../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(blog: BlogDbDocument) {
    await blog.save();
  }

  async getById(id: string) {
    return this.BlogModel.findById(id);
  }
}
