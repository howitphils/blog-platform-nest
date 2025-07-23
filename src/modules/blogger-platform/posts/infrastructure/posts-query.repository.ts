import { PostModelType } from './../domain/post.entity';
import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostView } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

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

    const filter = blogId ? { blogId } : {};

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
