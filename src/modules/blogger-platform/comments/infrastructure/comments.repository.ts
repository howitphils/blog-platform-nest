import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDbDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';

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

  async getCommentByIdOrFail(id: string): Promise<CommentDbDocument> {
    const comment = await this.CommentModel.findById(id);

    if (!comment) {
      throw new DomainException(
        'Comment not found',
        DomainExceptionCodes.NotFound,
      );
    }

    return comment;
  }
}
