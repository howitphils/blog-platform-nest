import { BlogsRepository } from './../../blogs/infrastructure/repository/blogs/blogs.repository';
import { PostModelType } from './../domain/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsRepository } from './../infrastructure/posts.repository';
import { UpdatePostDto } from '../dto/update-post.dto';
export declare class PostsService {
    private PostModel;
    private postsRepository;
    private blogsRepository;
    constructor(PostModel: PostModelType, postsRepository: PostsRepository, blogsRepository: BlogsRepository);
    createPost(dto: CreatePostDto): Promise<string>;
    updatePost(id: string, dto: UpdatePostDto): Promise<void>;
    deletePost(id: string): Promise<void>;
}
