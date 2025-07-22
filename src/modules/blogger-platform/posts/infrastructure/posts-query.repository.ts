import { PostModelType } from './../domain/post.entity';
import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostView } from '../api/view-dto/post.view-dto';

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

  async getPosts(queryParams: PostsQueryParams) {}
}
