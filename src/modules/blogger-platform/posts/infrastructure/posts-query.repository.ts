import { PostModelType } from './../domain/post.entity';
import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostView } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';
import { Blog, BlogModelType } from '../../blogs/domain/blog.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async getPostById(id: string): Promise<PostView> {
    const post = await this.PostModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostView.mapToView(post);
  }

  async getPosts(
    queryParams: PostsQueryParams,
    blogId?: string,
  ): Promise<PaginatedViewModel<PostView>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

    let filter = {};

    if (blogId) {
      const blog = await this.BlogModel.findById(blogId);

      if (!blog) {
        throw new NotFoundException('Blog not found');
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
      items: posts.map((post) => PostView.mapToView(post)),
    });
  }
}
