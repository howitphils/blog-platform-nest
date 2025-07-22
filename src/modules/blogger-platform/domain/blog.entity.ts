import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

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

  static createBlog(dto: CreateBlogDto): BlogDbDocument {
    const newBlog = new this();
    newBlog.name = dto.name;
    newBlog.description = dto.description;
    newBlog.websiteUrl = dto.websiteUrl;
    newBlog.isMembership = true;

    return newBlog as BlogDbDocument;
  }

  updateBlog(dto: UpdateBlogDto) {
    this.description = dto.description;
    this.name = dto.name;
    this.websiteUrl = dto.websiteUrl;
  }
}

export type BlogDbDocument = HydratedDocument<Blog>;

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogModelType = Model<BlogDbDocument> & typeof Blog;
