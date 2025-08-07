import {
  CommentLike,
  CommentLikeModelType,
} from './../blogger-platform/comments/domain/comment-like.entity';
import {
  Comment,
  CommentModelType,
} from './../blogger-platform/comments/domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { User, UserModelType } from '../users-accounts/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../blogger-platform/blogs/domain/blog.entity';
import {
  Post,
  PostModelType,
} from '../blogger-platform/posts/domain/post.entity';

@Controller('testing')
export class TestingAllDataController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllData() {
    await this.UserModel.deleteMany({});
    await this.BlogModel.deleteMany({});
    await this.PostModel.deleteMany({});
    await this.CommentModel.deleteMany({});
    await this.CommentLikeModel.deleteMany({});
  }
}
