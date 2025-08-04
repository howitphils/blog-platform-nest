import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { BloggersPlatformModule } from 'src/modules/blogger-platform/blogger-platform.module';
import { BlogsRepository } from 'src/modules/blogger-platform/blogs/infrastructure/repository/blogs/blogs.repository';
import { appSetup } from 'src/setup/app.setup';

describe('Blogs (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BloggersPlatformModule],
    })
      .overrideProvider(BlogsRepository)
      .useValue({ getAllBlogs: () => ['blog1', 'blog2'] })
      .compile();

    app = moduleFixture.createNestApplication();

    appSetup(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return all blogs', () => {
    return request(app.getHttpServer())
      .get('/blogs')
      .expect(200)
      .expect('Hello World!');
  });
});
