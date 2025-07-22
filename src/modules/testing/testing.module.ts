import { Module, Post } from '@nestjs/common';
import { TestingAllDataController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users-accounts/domain/user.entity';
import { Blog, BlogSchema } from '../blogger-platform/blogs/domain/blog.entity';
import { PostSchema } from '../blogger-platform/posts/domain/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [TestingAllDataController],
})
export class TestingModule {}
