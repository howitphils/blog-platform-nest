import TestAgent from 'supertest/lib/agent';
import { CreateBlogDto } from '../../src/modules/blogger-platform/blogs/dto/create-blog.dto';
import { appConfig } from '../../src/app.config';
import { HttpStatus } from '@nestjs/common';
import { BlogViewDto } from '../../src/modules/blogger-platform/blogs/api/view-dto/blog.view-dto';
import { basicAuth } from '../helpers/authorization';

export class BlogsTestManager {
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
}
