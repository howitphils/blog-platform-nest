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
    return this.postsQueryRepository.getPosts(queryParams);
  }

  @Get(':id')
  async getPostById(@Param('id', IsValidObjectId) id: string) {
    return this.postsQueryRepository.getPostByIdOrFail(id);
  }

  @Post()
  async createPost(@Body() dto: CreatePostInputDto) {
    const postId = await this.postsService.createPost({
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    return this.postsQueryRepository.getPostByIdOrFail(postId);
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

    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', IsValidObjectId) id: string) {
    return this.postsService.deletePost(id);
  }
}
