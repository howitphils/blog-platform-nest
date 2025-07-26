import { PostsQueryRepository } from './../infrastructure/posts-query.repository';
import { PostsService } from './../application/posts.service';
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
import { PostsQueryParams } from './input-dto/posts.query-params';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { UpdatePostInputDto } from './input-dto/update-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { IsValidObjectId } from 'src/core/decorators/validation/object-id';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getPosts(@Query() queryParams: PostsQueryParams) {
    const posts = await this.postsQueryRepository.getPosts(queryParams);
    return posts;
  }

  @Get(':id')
  async getPostById(@Param('id', IsValidObjectId) id: string) {
    const post = await this.postsQueryRepository.getPostById(id);
    return post;
  }

  @Post()
  async createPost(@Body() dto: CreatePostInputDto) {
    const postId = await this.postsService.createPost({
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    return createdPost;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', IsValidObjectId) id: string,
    @Body() dto: UpdatePostInputDto,
  ) {
    const updatePostDto: UpdatePostDto = {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
    };

    await this.postsService.updatePost(id, updatePostDto);

    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', IsValidObjectId) id: string) {
    await this.postsService.deletePost(id);
    return;
  }
}
