import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbDocument, BlogModelType } from '../domain/blog.entity';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/repository/blogs/blogs.repository';

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

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<void> {
    const targetBlog = await this.blogsRepository.getByIdOrFail(id);

    targetBlog.updateBlog(dto);

    await this.blogsRepository.save(targetBlog);
  }

  async deleteBlog(id: string): Promise<void> {
    const targetBlog = await this.blogsRepository.getByIdOrFail(id);

    targetBlog.deleteBlog();

    await this.blogsRepository.save(targetBlog);
  }

  async getBlogById(id: string): Promise<BlogDbDocument> {
    return this.blogsRepository.getByIdOrFail(id);
  }
}
