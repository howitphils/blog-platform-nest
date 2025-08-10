import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsService } from './blogs/application/blogs-service';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repository/blogs/blogs-query.repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts-query.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsController } from './posts/api/posts.controller';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from './comments/domain/comment-like.entity';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsController } from './comments/api/comments.controller';
import { CreateCommentHandler } from './comments/application/use-cases/create-comments.use-case';
import { GetCommentHandler } from './comments/application/queries/get-comment.query';
import { UsersAccountsModule } from '../users-accounts/users-accounts.module';
import { UpdateCommentHandler } from './comments/application/use-cases/update-comment.use-case';
import { UpdateCommentsLikeStatusHandler } from './comments/application/use-cases/update-comments-like-status.use-case';
import { DeleteCommentHandler } from './comments/application/use-cases/delete-comment.use-case';
import { GetCommentsHandler } from './comments/application/queries/get-comments.query';
import { UpdatePostsLikeStatusHandler } from './posts/application/use-cases/update-post-like-status.use-case';
import { CommentsLikesRepository } from './comments/infrastructure/comments-likes.repository';
import { PostsLikesRepository } from './posts/infrastructure/posts-like.query-repository';
import { PostLike, PostLikeSchema } from './posts/domain/post-like.entity';

const commandHandlers = [
  CreateCommentHandler,
  UpdateCommentHandler,
  UpdateCommentsLikeStatusHandler,
  DeleteCommentHandler,
  UpdatePostsLikeStatusHandler,
];

const queryHandlers = [GetCommentHandler, GetCommentsHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    UsersAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    CommentsQueryRepository,
    CommentsRepository,
    CommentsLikesRepository,
    PostsLikesRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
