import { Injectable } from '@nestjs/common';
import {
  CommentLike,
  CommentLikeDbDocument,
  CommentLikeModelType,
} from '../domain/comment-like.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  async save(like: CommentLikeDbDocument): Promise<string> {
    const result = await like.save();
    return result._id.toString();
  }

  async getLikeById(id: string): Promise<CommentLikeDbDocument | null> {
    return this.CommentLikeModel.findById(id);
  }

  async getLikeByUserIdAndCommentId({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }): Promise<CommentLikeDbDocument | null> {
    return this.CommentLikeModel.findOne({ userId, commentId });
  }
}
