import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { appSetup } from '../../src/setup/app.setup';
import { AppModule } from '../../src/app.module';
import { BlogsQueryRepository } from '../../src/modules/blogger-platform/blogs/infrastructure/repository/blogs/blogs-query.repository';

describe('Blogs (e2e)', () => {
  let app: INestApplication<App>;

  const res = ['blog1', 'blog2'];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BlogsQueryRepository)
      .useValue({ getBlogs: () => res })
      .compile();

    app = moduleFixture.createNestApplication();

    appSetup(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return all blogs', () => {
    return request(app.getHttpServer()).get('/blogs').expect(200).expect(res);
  });
});
