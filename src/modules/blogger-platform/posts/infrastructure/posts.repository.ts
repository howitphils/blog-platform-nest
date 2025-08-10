import { Post, PostDbDocument, PostModelType } from './../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async save(post: PostDbDocument): Promise<string> {
    const result = await post.save();
    return result._id.toString();
  }

  async getPostByIdOrFail(id: string): Promise<PostDbDocument> {
    const post = await this.PostModel.findById(id);

    if (!post) {
      throw new DomainException(
        'Post not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return post;
  }
}
