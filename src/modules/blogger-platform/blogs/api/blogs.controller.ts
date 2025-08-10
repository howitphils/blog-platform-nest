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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsService } from '../application/blogs-service';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs/blogs-query.repository';
import { CreatePostForBlogInputDto } from '../../posts/api/input-dto/create-post-for-blog.input-dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params';
import { appConfig } from '../../../../app.config';
import { IsValidObjectId } from '../../../../core/decorators/validation/object-id.validator';
import { BasicAuthGuard } from '../../../users-accounts/guards/basic/basic-auth.guard';
import { Public } from '../../../users-accounts/guards/basic/decorators/public.decorator';
import { JwtAuthOptionalGuard } from '../../../users-accounts/guards/bearer/jwt-auth.optional-guard';

@Controller(appConfig.MAIN_PATHS.BLOGS)
@UseGuards(BasicAuthGuard)
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Public()
  @Get()
  async getBlogs(@Query() query: BlogsQueryParams) {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Public()
  @Get(':id')
  async getBlogById(@Param('id', IsValidObjectId) id: string) {
    return this.blogsQueryRepository.getBlogByIdOrFail(id);
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthOptionalGuard)
  async getPostsForBlog(
    @Req() req: RequestWithOptionalUser,
    @Param('id', IsValidObjectId) id: string,
    @Query() queryParams: PostsQueryParams,
  ) {
    const userId = req.user ? req.user.id : null;
    return this.postsQueryRepository.getPosts(queryParams, userId, id);
  }

  @Post()
  async createdBlog(@Body() dto: CreateBlogInputDto) {
    const newBlogId = await this.blogsService.createBlog({
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    });

    return this.blogsQueryRepository.getBlogByIdOrFail(newBlogId);
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

    return this.postsQueryRepository.getPostByIdOrFail(postId);
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

    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id', IsValidObjectId) id: string) {
    return this.blogsService.deleteBlog(id);
  }
}
