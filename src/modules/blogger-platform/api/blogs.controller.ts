import { BlogsQueryRepository } from './../infrastructure/repository/blog-query.repository';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsService } from '../application/blogs-service';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogsQueryParams) {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param(':id') id: string) {
    return this.blogsQueryRepository.getBlogById(id);
  }

  @Post()
  async createdBlog(@Body() dto: CreateBlogInputDto) {
    const newBlogId = await this.blogsService.createBlog({
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    });

    const blogView = await this.blogsQueryRepository.getBlogById(newBlogId);

    return blogView;
  }

  @Put(':id')
  async updateBlog(
    @Body() updatedBlog: UpdateBlogInputDto,
    @Param(':id') id: string,
  ) {
    const updateBlogDto: UpdateBlogDto = {
      description: updatedBlog.description,
      name: updatedBlog.name,
      websiteUrl: updatedBlog.websiteUrl,
    };

    await this.blogsService.updateBlog(id, updateBlogDto);

    return;
  }
}
