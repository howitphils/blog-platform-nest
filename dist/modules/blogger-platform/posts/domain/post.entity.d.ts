import { HydratedDocument, Model } from 'mongoose';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostDomainDto } from '../dto/create-post-domain.dto';
import { NewestLikeDbDocument } from './newest-likes.schema';
export declare class Post {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    deletedAt: Date | null;
    dislikesCount: number;
    likesCount: number;
    myStatus: string;
    newestLikes: NewestLikeDbDocument[];
    createdAt: Date;
    updatedAt: Date;
    static createPost(dto: CreatePostDomainDto): PostDbDocument;
    updatePost(dto: UpdatePostDto): void;
    deletePost(): void;
}
export type PostDbDocument = HydratedDocument<Post>;
export declare const PostSchema: import("mongoose").Schema<Post, Model<Post, any, any, any, import("mongoose").Document<unknown, any, Post, any> & Post & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Post>, {}> & import("mongoose").FlatRecord<Post> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type PostModelType = Model<PostDbDocument> & typeof Post;
