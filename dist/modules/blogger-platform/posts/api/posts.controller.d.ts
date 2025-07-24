import { PostsQueryRepository } from './../infrastructure/posts-query.repository';
import { PostsService } from './../application/posts.service';
import { PostsQueryParams } from './input-dto/posts.query-params';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { UpdatePostInputDto } from './input-dto/update-post.dto';
export declare class PostsController {
    private postsService;
    private postsQueryRepository;
    constructor(postsService: PostsService, postsQueryRepository: PostsQueryRepository);
    getPosts(queryParams: PostsQueryParams): Promise<import("../../../../core/dto/pagination-view.base").PaginatedViewModel<import("./view-dto/post.view-dto").PostViewDto>>;
    getPostById(id: string): Promise<import("./view-dto/post.view-dto").PostViewDto>;
    createPost(dto: CreatePostInputDto): Promise<import("./view-dto/post.view-dto").PostViewDto>;
    updatePost(id: string, dto: UpdatePostInputDto): Promise<void>;
    deletePost(id: string): Promise<void>;
}
