import TestAgent from 'supertest/lib/agent';
import { CreateBlogDto } from '../../src/modules/blogger-platform/blogs/dto/create-blog.dto';
import { appConfig } from '../../src/app.settings';
import { HttpStatus } from '@nestjs/common';
import { BlogViewDto } from '../../src/modules/blogger-platform/blogs/api/view-dto/blog.view-dto';
import { basicAuth, jwtAuth } from './authorization';
import { PostViewDto } from '../../src/modules/blogger-platform/posts/api/view-dto/post.view-dto';
import {
  CreateUserDto,
  CreateUserDtoTest,
} from '../../src/modules/users-accounts/dto/create-user.dto';
import { UserViewDto } from '../../src/modules/users-accounts/application/queries/dto/user.view-dto';
import {
  CreatePostDto,
  CreatePostDtoTest,
} from '../../src/modules/blogger-platform/posts/application/use-cases/dto/create-post.dto';
import { CreateCommentInputDto } from '../../src/modules/blogger-platform/comments/api/input-dto/create-comment.input-dto';
import { CommentViewDto } from '../../src/modules/blogger-platform/comments/application/queries/dto/comment.view-dto';

export type CommentInfoType = {
  comment: CommentViewDto;
  token: string;
  postId: string;
};

export class TestManager {
  constructor(private req: TestAgent) {}

  createBlogDto(
    name?: string,
    description?: string,
    websiteUrl?: string,
  ): CreateBlogDto {
    return {
      name: name ?? 'test-blog',
      description: description ?? 'test-blog-description',
      websiteUrl: websiteUrl ?? 'https://test.com',
    };
  }

  async createBlog(dto?: CreateBlogDto) {
    if (!dto) {
      dto = this.createBlogDto();
    }

    const { body } = (await this.req
      .post(appConfig.MAIN_PATHS.BLOGS)
      .set(basicAuth)
      .send(dto)
      .expect(HttpStatus.CREATED)) as { body: BlogViewDto };

    return body;
  }

  async createBlogs(count: number) {
    const blogs: BlogViewDto[] = [];

    for (let i = 1; i <= count; i++) {
      const newBlog = await this.createBlog({
        name: `blog${i}`,
        description: `description${i}`,
        websiteUrl: `https://website.com${i}`,
      });

      blogs.push(newBlog);
    }

    return blogs;
  }

  // POSTS
  createPostDto(dto: CreatePostDtoTest): CreatePostDto {
    return {
      blogId: dto.blogId,
      title: dto.title ?? 'test-title',
      content: dto.content ?? 'test-content',
      shortDescription: dto.shortDescription ?? 'test-short-desc',
    };
  }

  async createPost(dto?: CreatePostDto) {
    if (!dto) {
      const blog = await this.createBlog();
      dto = this.createPostDto({ blogId: blog.id });
    }

    const { body } = (await this.req
      .post(appConfig.MAIN_PATHS.POSTS)
      .set(basicAuth)
      .send(dto)
      .expect(HttpStatus.CREATED)) as { body: PostViewDto };

    return body;
  }

  async createPosts(count: number, blogId?: string) {
    const posts: PostViewDto[] = [];

    if (!blogId) {
      blogId = (await this.createBlog()).id;
    }

    for (let i = 1; i <= count; i++) {
      const postDto = this.createPostDto({ blogId, title: `title${i}` });

      const newPost = await this.createPost(postDto);

      posts.push(newPost);
    }

    return posts;
  }

  //USERS
  createUserDto(dto: CreateUserDtoTest): CreateUserDto {
    return {
      login: dto.login ?? 'test-login',
      email: dto.email ?? 'test-email@email.com',
      password: dto.password ?? '123456',
    };
  }

  async createUser(dto?: CreateUserDto) {
    if (!dto) {
      dto = this.createUserDto({});
    }

    const { body } = (await this.req
      .post(appConfig.MAIN_PATHS.USERS)
      .set(basicAuth)
      .send(dto)
      .expect(HttpStatus.CREATED)) as { body: UserViewDto };

    return body;
  }

  async createUsers(count: number) {
    const users: UserViewDto[] = [];

    for (let i = 1; i <= count; i++) {
      const userDto = this.createUserDto({
        login: `user${i}`,
        email: `email${i}@email.com`,
      });

      const newUser = await this.createUser(userDto);

      users.push(newUser);
    }

    return users;
  }

  async getTokenPair(dto?: CreateUserDto) {
    if (!dto) {
      dto = this.createUserDto({
        login: 'user123',
        email: 'user1234@email.com',
      });
    }

    await this.createUser(dto);

    const res = await this.req
      .post(appConfig.MAIN_PATHS.AUTH + '/login')
      .send({
        loginOrEmail: dto.login,
        password: dto.password,
      })
      .expect(HttpStatus.OK);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accessToken = res.body.accessToken as string;
    const refreshToken = res.headers['set-cookie'][0].split('=')[1];

    return { accessToken, refreshToken };
  }

  async getUsersTokens(count: number) {
    const usersTokens: string[] = [];

    for (let i = 0; i < count; i++) {
      const userDto = this.createUserDto({
        login: `userddd${i}`,
        email: `emailzzzz${i}@email.com`,
      });

      const token = (await this.getTokenPair(userDto)).accessToken;

      usersTokens.push(token);
    }

    return usersTokens;
  }

  // COMMENTS
  createCommentInputDto(dto?: CreateCommentInputDto): CreateCommentInputDto {
    return { content: dto ? dto.content : 'randomcontentasdasdasdasd' };
  }

  async createComment(dto: CreateUserDto) {
    const dbPost = await this.createPost();

    const contentDto = this.createCommentInputDto();

    const token = (await this.getTokenPair(dto)).accessToken;

    const res = (await this.req
      .post(appConfig.MAIN_PATHS.POSTS + `/${dbPost.id}` + '/comments')
      .set(jwtAuth(token))
      .send(contentDto)
      .expect(HttpStatus.CREATED)) as { body: CommentViewDto };

    return {
      comment: res.body,
      token,
      postId: dbPost.id,
    } as CommentInfoType;
  }

  async createComments(count: number, postId: string) {
    const comments: CommentViewDto[] = [];

    const userDto = this.createUserDto({
      email: 'qwesd@mail.com',
      login: 'login33',
    });

    const token = (await this.getTokenPair(userDto)).accessToken;

    for (let i = 1; i <= count; i++) {
      const res = (await this.req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send({ content: 'a'.repeat(20) + i })
        .expect(HttpStatus.CREATED)) as { body: CommentViewDto };

      comments.push(res.body);
    }

    return comments;
  }
}
