import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDbDocument, CommentModelType } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async save(comment: CommentDbDocument) {
    const result = await comment.save();
    return result._id.toString();
  }

  async getCommentById(id: string): Promise<CommentDbDocument | null> {
    return this.CommentModel.findById(id);
  }
}
