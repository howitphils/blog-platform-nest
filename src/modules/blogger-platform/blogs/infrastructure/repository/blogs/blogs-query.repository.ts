import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';
import { Blog, BlogModelType } from '../../../domain/blog.entity';
import { BlogView } from '../../../api/view-dto/blog.view-dto';
import { BlogsQueryParams } from '../../../api/input-dto/get-blogs-query-params.input-dto';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getBlogById(id: string): Promise<BlogView> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid blog id');
    }

    const blog = await this.BlogModel.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog was not found');
    }

    return BlogView.mapToView(blog);
  }

  async getBlogs(
    queryParams: BlogsQueryParams,
  ): Promise<PaginatedViewModel<BlogView>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      queryParams;

    const filter = searchNameTerm
      ? {
          name: { $regex: searchNameTerm, options: 'i' },
        }
      : {};

    const blogs = await this.BlogModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(queryParams.calculateSkip())
      .limit(pageSize);

    const totalCount = await this.BlogModel.countDocuments(filter);

    return PaginatedViewModel.mapToView({
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map((blog) => BlogView.mapToView(blog)),
    });
  }
}
