import { PostsQueryRepository } from './../../posts/infrastructure/posts-query.repository';
import { PostsService } from './../../posts/application/posts.service';
import { BlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsService } from '../application/blogs-service';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs/blogs-query.repository';
import { createPostForBlogInputDto } from '../../posts/api/input-dto/create-post-for-blog.input-dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params';
export declare class BlogsController {
    private blogsQueryRepository;
    private blogsService;
    private postsService;
    private postsQueryRepository;
    constructor(blogsQueryRepository: BlogsQueryRepository, blogsService: BlogsService, postsService: PostsService, postsQueryRepository: PostsQueryRepository);
    getBlogs(query: BlogsQueryParams): Promise<import("../../../../core/dto/pagination-view.base").PaginatedViewModel<import("./view-dto/blog.view-dto").BlogViewDto>>;
    getBlogById(id: string): Promise<import("./view-dto/blog.view-dto").BlogViewDto>;
    getPostsForBlog(id: string, queryParams: PostsQueryParams): Promise<import("../../../../core/dto/pagination-view.base").PaginatedViewModel<import("../../posts/api/view-dto/post.view-dto").PostViewDto>>;
    createdBlog(dto: CreateBlogInputDto): Promise<import("./view-dto/blog.view-dto").BlogViewDto>;
    createPostForBlog(blogId: string, dto: createPostForBlogInputDto): Promise<import("../../posts/api/view-dto/post.view-dto").PostViewDto>;
    updateBlog(updatedBlog: UpdateBlogInputDto, id: string): Promise<void>;
    deleteBlog(id: string): Promise<void>;
}
