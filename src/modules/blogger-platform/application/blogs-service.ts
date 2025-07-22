import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsRepository } from './../infrastructure/repository/blogs.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { UpdateBlogDto } from '../dto/update-blog.dto';

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

  async updateBlog(id: string, dto: UpdateBlogDto) {
    const targetBlog = await this.blogsRepository.getById(id);

    if (!targetBlog) {
      throw new NotFoundException('Blog not found');
    }

    targetBlog.updateBlog({
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    });

    await this.blogsRepository.save(targetBlog);
  }
}
