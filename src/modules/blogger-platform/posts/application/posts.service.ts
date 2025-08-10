import { BlogsRepository } from './../../blogs/infrastructure/repository/blogs/blogs.repository';
import { Post, PostDbDocument, PostModelType } from './../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from './../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './use-cases/dto/create-post.dto';
import { UpdatePostDto } from './use-cases/dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.getByIdOrFail(dto.blogId);

    const newPost = this.PostModel.createPost({
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
      blogName: blog.name,
    });

    const createdId = await this.postsRepository.save(newPost);

    return createdId;
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<void> {
    await this.blogsRepository.getByIdOrFail(dto.blogId);

    const targetPost = await this.postsRepository.getPostByIdOrFail(id);

    targetPost.updatePost(dto);

    await this.postsRepository.save(targetPost);
  }

  async deletePost(id: string): Promise<void> {
    const targetPost = await this.postsRepository.getPostByIdOrFail(id);

    targetPost.deletePost();

    await this.postsRepository.save(targetPost);
  }

  async getPostByIdOrFail(id: string): Promise<PostDbDocument> {
    return this.postsRepository.getPostByIdOrFail(id);
  }
}
