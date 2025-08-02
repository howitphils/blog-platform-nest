import { Post, PostModelType } from './../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { Blog, BlogModelType } from '../../blogs/domain/blog.entity';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async getPostByIdOrFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findById(id);

    if (!post) {
      throw new DomainException(
        'Post not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return PostViewDto.mapToView(post);
  }

  async getPosts(
    queryParams: PostsQueryParams,
    blogId?: string,
  ): Promise<PaginatedViewModel<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

    let filter = {};

    if (blogId) {
      const blog = await this.BlogModel.findById(blogId);

      if (!blog) {
        throw new DomainException(
          'Blog not found',
          DomainExceptionCodes.NotFound,
        );
      }

      filter = { blogId };
    }

    const posts = await this.PostModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(queryParams.calculateSkip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.PostModel.countDocuments(filter);

    return PaginatedViewModel.mapToView({
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((post) => PostViewDto.mapToView(post)),
    });
  }
}
