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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsRepository,
    PostsQueryRepository,
    PostsService,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
