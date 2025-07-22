import { PostModelType } from './../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsRepository } from './../infrastructure/posts.repository';
import { Injectable, Post } from '@nestjs/common';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const newPost = this.PostModel.createPost({
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    const createdId = await this.postsRepository.save(newPost);

    return createdId;
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<void> {
    const targetPost = await this.postsRepository.getPostById(id);

    targetPost.updatePost(dto);

    await this.postsRepository.save(targetPost);

    return;
  }

  async deletePost(id: string): Promise<void> {
    const targetPost = await this.postsRepository.getPostById(id);

    targetPost.deletePost();

    await this.postsRepository.save(targetPost);

    return;
  }
}
