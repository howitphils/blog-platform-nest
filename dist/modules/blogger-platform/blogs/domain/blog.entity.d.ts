import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
export declare class Blog {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    static createBlog(dto: CreateBlogDto): BlogDbDocument;
    updateBlog(dto: UpdateBlogDto): void;
    deleteBlog(): void;
}
export type BlogDbDocument = HydratedDocument<Blog>;
export declare const BlogSchema: import("mongoose").Schema<Blog, Model<Blog, any, any, any, import("mongoose").Document<unknown, any, Blog, any> & Blog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Blog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Blog>, {}> & import("mongoose").FlatRecord<Blog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type BlogModelType = Model<BlogDbDocument> & typeof Blog;
