import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

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
}

export type PostDbDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);

export type PostModelType = Model<Post> & typeof Post;
