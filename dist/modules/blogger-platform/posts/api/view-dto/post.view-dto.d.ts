import { PostDbDocument } from '../../domain/post.entity';
declare enum LikeStatuses {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}
export declare class PostView {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatuses;
        newestLikes: [];
    };
    static mapToView(dto: PostDbDocument): PostView;
}
export {};
