import { InjectModel } from '@nestjs/mongoose';
import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { User, UserModelType } from '../users-accounts/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../blogger-platform/blogs/domain/blog.entity';
import { PostModelType } from '../blogger-platform/posts/domain/post.entity';
import { HttpStatusCodes } from 'src/core/eums/http-status-codes';

@Controller('testing')
export class TestingAllDataController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatusCodes.No_Content)
  async removeAllData() {
    await this.UserModel.deleteMany({});
    await this.BlogModel.deleteMany({});
    await this.PostModel.deleteMany({});
  }
}
