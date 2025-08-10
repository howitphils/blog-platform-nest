import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatuses } from '../../../../core/enums/like-statuses';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostLikeDomainDto } from './dto/create-post-like.domain-dto';

@Schema({ timestamps: true, collection: 'postsLikes' })
export class PostLike {
  @Prop({ type: String, enum: Object.values(LikeStatuses), required: true })
  status: LikeStatuses;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  createdAt: string;
  updatedAt: string;

  static createPostLike(dto: CreatePostLikeDomainDto): PostLikeDbDocument {
    const newLike = new this();

    newLike.status = dto.status;
    newLike.postId = dto.postId;
    newLike.userId = dto.userId;
    newLike.userLogin = dto.userLogin;

    return newLike as PostLikeDbDocument;
  }

  updateStatus(newStatus: LikeStatuses) {
    this.status = newStatus;
  }
}

export type PostLikeDbDocument = HydratedDocument<PostLike>;

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.loadClass(PostLike);

export type PostLikeModelType = Model<PostLikeDbDocument> & typeof PostLike;
