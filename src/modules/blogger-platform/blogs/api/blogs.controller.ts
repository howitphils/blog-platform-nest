import { PostsQueryRepository } from './../../posts/infrastructure/posts-query.repository';
import { PostsService } from './../../posts/application/posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CreatePostForBlogInputDto } from '../../posts/api/input-dto/create-post-for-blog.input-dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params';
import { IsValidObjectId } from 'src/core/decorators/validation/object-id';
import { appConfig } from 'src/app.config';

@Controller(appConfig.MAIN_PATHS.BLOGS)
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
  async getBlogById(@Param('id', IsValidObjectId) id: string) {
    return this.blogsQueryRepository.getBlogByIdOrFail(id);
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id', IsValidObjectId) id: string,
    @Query() queryParams: PostsQueryParams,
  ) {
    return this.postsQueryRepository.getPosts(queryParams, id);
  }

  @Post()
  async createdBlog(@Body() dto: CreateBlogInputDto) {
    const newBlogId = await this.blogsService.createBlog({
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    });

    const blogView =
      await this.blogsQueryRepository.getBlogByIdOrFail(newBlogId);

    return blogView;
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id', IsValidObjectId) blogId: string,
    @Body() dto: CreatePostForBlogInputDto,
  ) {
    const postId = await this.postsService.createPost({
      blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    const createdPost =
      await this.postsQueryRepository.getPostByIdOrFail(postId);

    return createdPost;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() updatedBlog: UpdateBlogInputDto,
    @Param('id', IsValidObjectId) id: string,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id', IsValidObjectId) id: string) {
    await this.blogsService.deleteBlog(id);
    return;
  }
}
