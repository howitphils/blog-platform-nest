import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryParams } from './input-dto/posts.query-params';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { UpdatePostInputDto } from './input-dto/update-post.dto';
import { IsValidObjectId } from '../../../../core/decorators/validation/object-id.validator';
import { appSettings } from '../../../../app.settings';
import { BasicAuthGuard } from '../../../users-accounts/guards/basic/basic-auth.guard';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { CommentsQueryParams } from '../../comments/api/input-dto/get-comments.query-params';
import { CreateCommentInputDto } from '../../comments/api/input-dto/create-comment.input-dto';
import { JwtAccessAuthGuard } from '../../../users-accounts/guards/bearer/jwt-access-token.auth-guard';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comments.use-case';
import { JwtAuthOptionalGuard } from '../../../users-accounts/guards/bearer/jwt-auth.optional-guard';
import { GetCommentsQuery } from '../../comments/application/queries/get-comments.query';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { CommentViewDto } from '../../comments/application/queries/dto/comment.view-dto';
import { UpdatePostDto } from '../application/use-cases/dto/update-post.dto';
import { UpdatePostLikeStatusInputDto } from './input-dto/update-post-like-status.input-dto';
import { UpdatePostLikeStatusCommand } from '../application/use-cases/update-post-like-status.use-case';

@Controller(appSettings.MAIN_PATHS.POSTS)
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(JwtAuthOptionalGuard)
  async getPosts(
    @Req() req: RequestWithOptionalUser,
    @Query() query: PostsQueryParams,
  ) {
    return this.postsQueryRepository.getPosts({
      queryParams: query,
      user: req.user,
      blogId: null,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthOptionalGuard)
  async getPostById(
    @Req() req: RequestWithOptionalUser,
    @Param('id', IsValidObjectId) id: string,
  ) {
    return this.postsQueryRepository.getPostByIdOrFail({
      postId: id,
      user: req.user,
    });
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthOptionalGuard)
  async getComments(
    @Req() req: RequestWithOptionalUser,
    @Query() query: CommentsQueryParams,
    @Param('id', IsValidObjectId) id: string,
  ) {
    return this.queryBus.execute<
      GetCommentsQuery,
      PaginatedViewModel<CommentViewDto>
    >(new GetCommentsQuery({ query, postId: id, user: req.user }));
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: CreatePostInputDto) {
    const postId = await this.postsService.createPost({
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
      title: dto.title,
    });

    return this.postsQueryRepository.getPostByIdOrFail({ postId, user: null });
  }

  @Post(':id/comments')
  @UseGuards(JwtAccessAuthGuard)
  async createComment(
    @Req() req: RequestWithAccessUser,
    @Param('id', IsValidObjectId) id: string,
    @Body() dto: CreateCommentInputDto,
  ) {
    const createdId = await this.commandBus.execute<
      CreateCommentCommand,
      string
    >(
      new CreateCommentCommand({
        content: dto.content,
        userId: req.user.id,
        postId: id,
      }),
    );

    return this.commentsQueryRepository.getCommentById(createdId, req.user.id);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
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

  @Put(':id/like-status')
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Req() req: RequestWithAccessUser,
    @Param('id', IsValidObjectId) id: string,
    @Body() dto: UpdatePostLikeStatusInputDto,
  ) {
    return this.commandBus.execute<UpdatePostLikeStatusCommand, void>(
      new UpdatePostLikeStatusCommand({
        likeStatus: dto.likeStatus,
        postId: id,
        userId: req.user.id,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', IsValidObjectId) id: string) {
    return this.postsService.deletePost(id);
  }
}
