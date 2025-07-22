import { Module, Post } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsService } from './blogs/application/blogs-service';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repository/blogs/blogs-query.repository';
import { PostSchema } from './posts/domain/post.entity';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts-query.repository';
import { PostsService } from './posts/application/posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogsController],
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
