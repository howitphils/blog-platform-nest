import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Schema({ timestamps: true })
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

  createdAt: Date;
  updatedAt: Date;

  static createPost(dto: CreatePostDto): PostDbDocument {
    const newPost = new this();
    newPost.title = dto.title;
    newPost.content = dto.content;
    newPost.shortDescription = dto.shortDescription;
    newPost.blogId = dto.blogId;

    return newPost as PostDbDocument;
  }

  updatePost(dto: UpdatePostDto) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
    this.blogId = dto.blogId;
  }

  deletePost() {
    if (this.deletedAt !== null) {
      throw new Error('Post already deleted');
    }
    this.deletedAt = new Date();
  }
}

export type PostDbDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);

export type PostModelType = Model<Post> & typeof Post;
