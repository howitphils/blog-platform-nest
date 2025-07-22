import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { Injectable } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/repository/blogs/blogs.repository';
import { CreatePostDto } from '../../posts/dto/create-post.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const newBlog = this.BlogModel.createBlog(dto);

    const createdId = await this.blogsRepository.save(newBlog);

    return createdId;
  }

  async createPostForBlog(dto: CreatePostDto) {
    await this.blogsRepository.getById(dto.blogId);
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<void> {
    const targetBlog = await this.blogsRepository.getById(id);

    targetBlog.updateBlog({
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    });

    await this.blogsRepository.save(targetBlog);

    return;
  }

  async deleteBlog(id: string): Promise<void> {
    const targetBlog = await this.blogsRepository.getById(id);

    targetBlog.deleteBlog();

    await this.blogsRepository.save(targetBlog);

    return;
  }
}
