import { PostsQueryRepository } from './../../posts/infrastructure/posts-query.repository';
import { PostsService } from './../../posts/application/posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsService } from '../application/blogs-service';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs/blogs-query.repository';
import { createPostForBlogInputDto } from '../../posts/api/input-dto/create-post-for-blog.input-dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogsQueryParams) {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogsQueryRepository.getBlogById(id);
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id') id: string,
    @Query() queryParams: PostsQueryParams,
  ) {
    await this.blogsService.getBlogById(id);
    return this.postsQueryRepository.getPosts(queryParams, id);
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

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() dto: createPostForBlogInputDto,
  ) {
    const postId = await this.postsService.createPost({
      blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    return createdPost;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Body() updatedBlog: UpdateBlogInputDto,
    @Param('id') id: string,
  ) {
    const updateBlogDto: UpdateBlogDto = {
      description: updatedBlog.description,
      name: updatedBlog.name,
      websiteUrl: updatedBlog.websiteUrl,
    };

    await this.blogsService.updateBlog(id, updateBlogDto);

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.deleteBlog(id);
    return;
  }
}
