import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDbDocument,
  BlogModelType,
} from '../../../domain/blog.entity';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(blog: BlogDbDocument): Promise<string> {
    const result = await blog.save();
    return result._id.toString();
  }

  async getByIdOrFail(id: string): Promise<BlogDbDocument> {
    const targetBlog = await this.BlogModel.findById(id);

    if (!targetBlog) {
      throw new DomainException(
        'Blog not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return targetBlog;
  }
}
