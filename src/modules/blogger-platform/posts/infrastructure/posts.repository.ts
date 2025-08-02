import { Post, PostDbDocument, PostModelType } from './../domain/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async save(post: PostDbDocument): Promise<string> {
    const result = await post.save();
    return result._id.toString();
  }

  async getPostById(id: string): Promise<PostDbDocument> {
    const post = await this.PostModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
