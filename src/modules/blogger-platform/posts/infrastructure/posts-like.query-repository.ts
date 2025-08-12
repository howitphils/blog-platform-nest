import { PostLikeModelType } from './../domain/post-like.entity';
import { Injectable } from '@nestjs/common';
import { PostLike, PostLikeDbDocument } from '../domain/post-like.entity';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatuses } from '../../../../core/enums/like-statuses';

@Injectable()
export class PostsLikesRepository {
  constructor(
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
  ) {}

  async save(like: PostLikeDbDocument): Promise<string> {
    const result = await like.save();
    return result._id.toString();
  }

  async getLikeByIdOrFail(id: string): Promise<PostLikeDbDocument | null> {
    const like = await this.PostLikeModel.findById(id);

    if (!like) {
      throw new DomainException(
        'Like not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return like;
  }

  async getPostLikeByUserIdAndPostId({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<PostLikeDbDocument | null> {
    return this.PostLikeModel.findOne({ userId, postId });
  }

  // TODO: limit to variable
  async getNewestLikes(
    postId: string,
    limit: number = 3,
  ): Promise<PostLikeDbDocument[]> {
    return this.PostLikeModel.find({
      postId,
      status: LikeStatuses.Like,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
