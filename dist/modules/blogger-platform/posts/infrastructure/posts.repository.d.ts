import { PostDbDocument, PostModelType } from './../domain/post.entity';
export declare class PostsRepository {
    private PostModel;
    constructor(PostModel: PostModelType);
    save(post: PostDbDocument): Promise<string>;
    getPostById(id: string): Promise<PostDbDocument>;
}
