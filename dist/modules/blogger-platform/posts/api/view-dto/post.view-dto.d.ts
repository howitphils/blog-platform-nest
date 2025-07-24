import { PostDbDocument } from '../../domain/post.entity';
declare enum LikeStatuses {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}
export declare class PostViewDto {
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
        newestLikes: Array<any>;
    };
    static mapToView(dto: PostDbDocument): PostViewDto;
}
export {};
