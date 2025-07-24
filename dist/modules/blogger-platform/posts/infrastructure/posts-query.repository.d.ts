import { PostModelType } from './../domain/post.entity';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from 'src/core/dto/pagination-view.base';
import { BlogModelType } from '../../blogs/domain/blog.entity';
export declare class PostsQueryRepository {
    private PostModel;
    private BlogModel;
    constructor(PostModel: PostModelType, BlogModel: BlogModelType);
    getPostById(id: string): Promise<PostViewDto>;
    getPosts(queryParams: PostsQueryParams, blogId?: string): Promise<PaginatedViewModel<PostViewDto>>;
}
