import TestAgent from 'supertest/lib/agent';
import { CreateBlogDto } from '../../src/modules/blogger-platform/blogs/dto/create-blog.dto';
import { appConfig } from '../../src/app.config';
import { HttpStatus } from '@nestjs/common';
import { BlogViewDto } from '../../src/modules/blogger-platform/blogs/api/view-dto/blog.view-dto';
import { basicAuth } from './authorization';
import { CreatePostDto } from '../../src/modules/blogger-platform/posts/dto/create-post.dto';
import { PostViewDto } from '../../src/modules/blogger-platform/posts/api/view-dto/post.view-dto';

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
  createPostDto(
    blogId: string,
    title?: string,
    content?: string,
    shortDescription?: string,
  ): CreatePostDto {
    return {
      title: title ?? 'test-title',
      content: content ?? 'test-content',
      shortDescription: shortDescription ?? 'test-short-desc',
      blogId,
    };
  }

  async createPost(dto?: CreatePostDto) {
    if (!dto) {
      const blog = await this.createBlog();
      dto = this.createPostDto(blog.id);
    }

    const { body } = (await this.req
      .post(appConfig.MAIN_PATHS.POSTS)
      .set(basicAuth)
      .send(dto)
      .expect(HttpStatus.CREATED)) as { body: PostViewDto };

    return body;
  }

  async createPosts(count: number) {
    const posts: PostViewDto[] = [];
    const blogId = (await this.createBlog()).id;

    for (let i = 1; i <= count; i++) {
      const postDto = this.createPostDto(blogId, `title${i}`);

      const newPost = await this.createPost(postDto);

      posts.push(newPost);
    }

    return posts;
  }
}
