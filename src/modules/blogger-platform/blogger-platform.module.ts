import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './api/domain/blog.entity';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsService } from './api/application/blogs-service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsRepository, BlogsService],
  exports: [],
})
export class BloggersPlatformModule {}
