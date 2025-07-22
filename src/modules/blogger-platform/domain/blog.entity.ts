import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true, minlength: 1, maxlength: 50 })
  name: string;

  @Prop({ type: String, required: true, minlength: 1, maxlength: 150 })
  description: string;

  @Prop({ type: String, required: true, minlength: 1, maxlength: 50 })
  websiteUrl: string;

  @Prop({ type: Boolean, required: true })
  isMembership: boolean;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type BlogDbDocument = HydratedDocument<Blog>;

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogModelType = Model<BlogDbDocument> & typeof Blog;
