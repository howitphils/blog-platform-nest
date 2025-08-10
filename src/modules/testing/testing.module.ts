import { Module } from '@nestjs/common';
import { TestingAllDataController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users-accounts/domain/user.entity';
import { Blog, BlogSchema } from '../blogger-platform/blogs/domain/blog.entity';
import { PostSchema, Post } from '../blogger-platform/posts/domain/post.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from '../blogger-platform/comments/domain/comment-like.entity';
import {
  PostLike,
  PostLikeSchema,
} from '../blogger-platform/posts/domain/post-like.entity';
import {
  CommentSchema,
  Comment,
} from '../blogger-platform/comments/domain/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [TestingAllDataController],
})
export class TestingModule {}
