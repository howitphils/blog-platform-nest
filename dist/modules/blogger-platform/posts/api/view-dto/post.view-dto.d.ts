import { PostDbDocument } from '../../domain/post.entity';
export declare class PostView {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    static mapToView(dto: PostDbDocument): PostView;
}
