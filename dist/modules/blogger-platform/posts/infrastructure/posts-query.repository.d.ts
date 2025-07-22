import { PostModelType } from './../domain/post.entity';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostView } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';
export declare class PostsQueryRepository {
    private PostModel;
    constructor(PostModel: PostModelType);
    getPostById(id: string): Promise<PostView>;
    getPosts(queryParams: PostsQueryParams, blogId?: string): Promise<PaginatedViewModel<PostView>>;
}
