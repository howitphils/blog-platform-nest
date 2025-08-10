import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostLikeDbDocument } from './post-like.entity';
import { CreatePostDomainDto } from './dto/create-post-domain.dto';
import { UpdatePostDto } from '../application/use-cases/dto/update-post.dto';
import { addPreFilter } from '../../../../core/utils/add-pre-filter';

@Schema({ timestamps: true, collection: 'posts' })
export class Post {
  @Prop({ type: String, required: true, minLength: 1, maxLength: 100 })
  title: string;

  @Prop({ type: String, required: true, minLength: 1, maxLength: 100 })
  shortDescription: string;

  @Prop({ type: String, required: true, minLength: 1, maxLength: 1000 })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  @Prop({ type: Date, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: String, required: true, default: 'None' })
  myStatus: string;

  @Prop({ type: Array<PostLikeDbDocument> })
  newestLikes: PostLikeDbDocument[];

  createdAt: Date;
  updatedAt: Date;

  static createPost(dto: CreatePostDomainDto): PostDbDocument {
    const newPost = new this();

    newPost.title = dto.title;
    newPost.content = dto.content;
    newPost.shortDescription = dto.shortDescription;
    newPost.blogId = dto.blogId;
    newPost.blogName = dto.blogName;
    newPost.newestLikes = [];

    return newPost as PostDbDocument;
  }

  updatePost(dto: UpdatePostDto) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
    this.blogId = dto.blogId;
  }

  updateNewestLikes(likes: PostLikeDbDocument[]) {
    this.newestLikes = likes;
  }

  deletePost() {
    if (this.deletedAt !== null) {
      throw new Error('Post already deleted');
    }
    this.deletedAt = new Date();
  }

  updateLikeOrDislikeCount(
    field: 'dislikesCount' | 'likesCount',
    operation: 'increase' | 'decrease',
  ) {
    if (operation === 'increase') {
      this[field] += 1;
    }

    if (operation === 'decrease') {
      this[field] -= 1;
    }

    if (this[field] < 0) {
      this[field] = 0;
    }
  }
}

export type PostDbDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);
addPreFilter(PostSchema, 'deletedAt');

export type PostModelType = Model<PostDbDocument> & typeof Post;
