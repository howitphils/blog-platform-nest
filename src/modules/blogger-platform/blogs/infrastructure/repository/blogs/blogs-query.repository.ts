import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedViewModel } from '../../../../../../core/dto/pagination-view.base';
import { Blog, BlogModelType } from '../../../domain/blog.entity';
import { BlogViewDto } from '../../../api/view-dto/blog.view-dto';
import { BlogsQueryParams } from '../../../api/input-dto/get-blogs-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getBlogByIdOrFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findById(id);

    if (!blog) {
      throw new DomainException(
        'Blog not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return BlogViewDto.mapToView(blog);
  }

  async getBlogs(
    queryParams: BlogsQueryParams,
  ): Promise<PaginatedViewModel<BlogViewDto>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      queryParams;

    const filter = searchNameTerm
      ? {
          name: { $regex: searchNameTerm, $options: 'i' },
        }
      : {};

    const blogs = await this.BlogModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(queryParams.calculateSkip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.BlogModel.countDocuments(filter);

    return PaginatedViewModel.mapToView({
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map((blog) => BlogViewDto.mapToView(blog)),
    });
  }
}
