import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatuses } from '../../../../core/enums/like-statuses';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentLikeDto } from '../dto/create-like.dto';

@Schema({ timestamps: true, collection: 'commentLikes' })
export class CommentLike {
  @Prop({ type: String, enum: Object.values(LikeStatuses), required: true })
  status: LikeStatuses;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  commentId: string;

  createdAt: string;
  updatedAt: string;

  static createLike(dto: CreateCommentLikeDto): CommentLikeDbDocument {
    const newCommentLike = new this();

    newCommentLike.status = dto.status;
    newCommentLike.userId = dto.userId;
    newCommentLike.commentId = dto.commentId;

    return newCommentLike as CommentLikeDbDocument;
  }

  updateStatus(newStatus: LikeStatuses) {
    this.status = newStatus;
  }
}

export type CommentLikeDbDocument = HydratedDocument<CommentLike>;

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);

CommentLikeSchema.loadClass(CommentLike);

export type CommentLikeModelType = Model<CommentLikeDbDocument> &
  typeof CommentLike;

CommentLikeSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

CommentLikeSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
