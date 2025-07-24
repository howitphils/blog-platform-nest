import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogDbDocument, BlogModelType } from '../domain/blog.entity';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/repository/blogs/blogs.repository';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
export declare class BlogsService {
    private BlogModel;
    private blogsRepository;
    constructor(BlogModel: BlogModelType, blogsRepository: BlogsRepository);
    createBlog(dto: CreateBlogDto): Promise<string>;
    createPostForBlog(dto: CreatePostDto): Promise<void>;
    updateBlog(id: string, dto: UpdateBlogDto): Promise<void>;
    deleteBlog(id: string): Promise<void>;
    getBlogById(id: string): Promise<BlogDbDocument>;
}
