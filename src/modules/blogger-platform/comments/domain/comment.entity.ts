import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDomainDto } from './dto/create-comment.domain-dto';
import { UpdateCommentDomainDto } from './dto/update-comment.dto';

export const commentContentLength = {
  min: 20,
  max: 300,
};

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ type: String, required: true, minlength: 1, maxlength: 100 })
  content: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true, minlength: 1, maxlength: 50 })
  userLogin: string;

  @Prop({ type: Number, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date;

  createdAt: string;
  updatedAt: string;

  static createInstance(dto: CreateCommentDomainDto): CommentDbDocument {
    const newComment = new this();

    newComment.content = dto.content;
    newComment.userId = dto.userId;
    newComment.userLogin = dto.userLogin;

    return newComment as CommentDbDocument;
  }

  updateComment(dto: UpdateCommentDomainDto) {
    this.content = dto.content;
  }

  deleteComment() {
    if (this.deletedAt !== null) {
      throw new Error('Comment is alredy deleted');
    }
    this.deletedAt = new Date();
  }
}

export type CommentDbDocument = HydratedDocument<Comment>;

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentModelType = Model<CommentDbDocument> & typeof Comment;

CommentSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

CommentSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
