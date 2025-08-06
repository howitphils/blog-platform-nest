/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { clearCollections } from '../helpers/clear-collections';
import TestAgent from 'supertest/lib/agent';
import { appConfig } from '../../src/app.config';
import { PaginatedViewModel } from '../../src/core/dto/pagination-view.base';
import { BlogViewDto } from '../../src/modules/blogger-platform/blogs/api/view-dto/blog.view-dto';
import { TestManager } from '../helpers/test-manager';
import { CreateBlogDto } from '../../src/modules/blogger-platform/blogs/dto/create-blog.dto';
import { basicAuth } from '../helpers/authorization';
import { makeIncorrectId } from '../helpers/incorrect-blog-id';
import { initSettings } from '../helpers/init-settings';

describe('Blogs (e2e)', () => {
  let app: INestApplication<App>;
  let req: TestAgent;
  let testManager: TestManager;

  beforeAll(async () => {
    const result = await initSettings();

    app = result.app;
    req = result.req;
    testManager = result.testManger;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('get blogs with pagination', () => {
    let blogsSeeds: BlogViewDto[];

    beforeAll(async () => {
      blogsSeeds = await testManager.createBlogs(12);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return all blogs with added pageSize and sortDirection', async () => {
      const { body } = (await req
        .get('/blogs?pageSize=12&sortDirection=asc')
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<BlogViewDto>;
      };

      expect(body).toEqual({
        page: 1,
        pagesCount: 1,
        pageSize: 12,
        totalCount: 12,
        items: blogsSeeds,
      } as PaginatedViewModel<BlogViewDto>);
    });

    it('should return all blogs with added pageNumber and sorting by name', async () => {
      const { body } = (await req
        .get('/blogs?sortBy=name&pageNumber=2&sortDirection=asc')
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<BlogViewDto>;
      };

      expect(body.items.length).toBe(2);
      expect(body.items[0].name).toBe('blog8');
      expect(body.items[1].name).toBe('blog9');
      expect(body.page).toBe(2);
      expect(body.pagesCount).toBe(2);
      expect(body.totalCount).toBe(12);
      expect(body.pageSize).toBe(10);
    });
  });

  describe('create blog', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should create new blog', async () => {
      const newBlogDto: CreateBlogDto = {
        name: 'newBlog',
        description: 'newDescr',
        websiteUrl: 'https://hi.com',
      };

      const res = await req
        .post('/blogs')
        .set(basicAuth)
        .send(newBlogDto)
        .expect(HttpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: newBlogDto.name,
        description: newBlogDto.description,
        websiteUrl: newBlogDto.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('should not create new blog with incorrect input values', async () => {
      const minInvalidBlogDto = {
        name: '',
        description: '',
        websiteUrl: 'daszc',
      };

      const maxInvalidBlogDto = {
        name: 'a'.repeat(16),
        description: 'b'.repeat(501),
        websiteUrl: 'c'.repeat(101),
      };

      await req
        .post('/blogs')
        .set(basicAuth)
        .send(minInvalidBlogDto)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .post('/blogs')
        .set(basicAuth)
        .send(maxInvalidBlogDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create new blog by unauthorized user', async () => {
      await req.post('/blogs').send({}).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get blog by id', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let blogId = '';
    it('should return a blog by id', async () => {
      const blogSeed = await testManager.createBlog();

      blogId = blogSeed.id;

      const { body } = await req
        .get(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(blogSeed);
    });

    it('should return a blog by not existing id', async () => {
      await req
        .get(appConfig.MAIN_PATHS.BLOGS + '/' + makeIncorrectId(blogId))
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not return a blog by invalid id type', async () => {
      await req
        .get(appConfig.MAIN_PATHS.BLOGS + '/22')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('update blog', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let blogId = '';

    it('should update the blog', async () => {
      const updatedBlogDto = testManager.createBlogDto(
        'new-name',
        'new-descr',
        'https://new-web.com',
      );

      const createdBlog = await testManager.createBlog();
      blogId = createdBlog.id;

      await req
        .put(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(updatedBlogDto)
        .expect(HttpStatus.NO_CONTENT);

      const res = await req
        .get(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: createdBlog.id,
        name: updatedBlogDto.name,
        description: updatedBlogDto.description,
        websiteUrl: updatedBlogDto.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('should not update the blog with incorrect input values', async () => {
      const minInvalidBlogDto = testManager.createBlogDto('', '', 'random');

      const maxInvalidBlogDto = testManager.createBlogDto(
        'a'.repeat(16),
        'b'.repeat(501),
        'c'.repeat(101),
      );

      await req
        .put(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(minInvalidBlogDto)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .put(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(maxInvalidBlogDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update not existing blog', async () => {
      const newBlogDto = testManager.createBlogDto('new_blog_name');

      await req
        .put(appConfig.MAIN_PATHS.BLOGS + '/' + makeIncorrectId(blogId))
        .set(basicAuth)
        .send(newBlogDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not update the blog with incorrect id type', async () => {
      const newBlogDto = testManager.createBlogDto('new_blog_name');

      await req
        .put(appConfig.MAIN_PATHS.BLOGS + '/22')
        .set(basicAuth)
        .send(newBlogDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update the blog by unauthorized user', async () => {
      await req
        .put(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  // describe('return all posts for a specific blog', () => {
  //   afterAll(async () => {
  //     await clearCollections(req);
  //   });

  //   let blogId = '';
  //   it('should return all posts for a specific blog', async () => {
  //     const blogDb = await createNewBlogInDb();

  //     blogId = blogDb.id;

  //     const res = await req
  //       .get(appConfig.MAIN_PATHS.BLOGS + `/${blogDb.id}` + '/posts')
  //       .expect(HttpStatus.OK);

  //     expect(res.body).toEqual(defaultPagination);
  //   });

  //   it('should not return all posts for a specific blog with incorrect blogId', async () => {
  //     await req
  //       .get(appConfig.MAIN_PATHS.BLOGS + '/22' + '/posts')
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });
  //   it('should not return all posts for not existing blog', async () => {
  //     await req
  //       .get(
  //         appConfig.MAIN_PATHS.BLOGS +
  //           `/${blogId.slice(0, -2) + 'ab'}` +
  //           '/posts',
  //       )
  //       .expect(HttpStatus.NOT_FOUND);
  //   });
  // });

  // describe('create post for a specific blog', () => {
  //   afterAll(async () => {
  //     await clearCollections(app);
  //   });

  //   let blogId = '';
  //   it('should create new post for a specific blog', async () => {
  //     const blogDb = await createNewBlogInDb();
  //     const newPostDto = createPostForBlogDto({});

  //     blogId = blogDb.id;

  //     const res = await req
  //       .post(appConfig.MAIN_PATHS.BLOGS + `/${blogId}` + '/posts')
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(HttpStatus.Created);

  //     expect(res.body).toEqual({
  //       id: expect.any(String),
  //       title: newPostDto.title,
  //       shortDescription: newPostDto.shortDescription,
  //       content: newPostDto.content,
  //       blogId: blogDb.id,
  //       blogName: expect.any(String),
  //       createdAt: expect.any(String),
  //       extendedLikesInfo: {
  //         dislikesCount: 0,
  //         likesCount: 0,
  //         myStatus: LikeStatuses.None,
  //         newestLikes: [],
  //       },
  //     });

  //     await req
  //       .get(appConfig.MAIN_PATHS.POSTS + `/${res.body.id}`)
  //       .expect(HttpStatus.OK);
  //   });

  //   it('should not create new post for a specific blog with incorrect blogId', async () => {
  //     const newPostDto = createPostForBlogDto({});

  //     await req
  //       .post(appConfig.MAIN_PATHS.BLOGS + '/22/posts')
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });

  //   it('should not create new post for not existing blog', async () => {
  //     const newPostDto = createPostForBlogDto({});

  //     await req
  //       .post(
  //         appConfig.MAIN_PATHS.BLOGS + `/${blogId.slice(0, -1) + 'a'}/posts`,
  //       )
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(HttpStatus.NOT_FOUND);
  //   });

  //   it('should not create new post for a specific blog with incorrect input values', async () => {
  //     const invalidPostDtoMin = createPostForBlogDto({
  //       title: '',
  //       content: '',
  //       shortDescription: '',
  //     });

  //     const invalidPostDtoMax = createPostForBlogDto({
  //       title: 'a'.repeat(31),
  //       content: 'b'.repeat(101),
  //       shortDescription: 'c'.repeat(1001),
  //     });

  //     await req
  //       .post(appConfig.MAIN_PATHS.BLOGS + `/${blogId}` + '/posts')
  //       .set(basicAuth)
  //       .send(invalidPostDtoMin)
  //       .expect(HttpStatus.BAD_REQUEST);

  //     await req
  //       .post(appConfig.MAIN_PATHS.BLOGS + `/${blogId}` + '/posts')
  //       .set(basicAuth)
  //       .send(invalidPostDtoMax)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });

  //   it('should not create new post for a specific blog without authorization', async () => {
  //     const postDto = createPostForBlogDto({});

  //     await req
  //       .post(appConfig.MAIN_PATHS.BLOGS + `/${blogId}` + '/posts')
  //       .send(postDto)
  //       .expect(HttpStatus.UNAUTHORIZED);
  //   });
  // });

  describe('delete blog', () => {
    let blogId = '';

    beforeAll(async () => {
      const blogDb = await testManager.createBlog();
      blogId = blogDb.id;
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should not delete the blog by unauthorized user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not delete the blog with incorrect id type', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.BLOGS + '/22')
        .set(basicAuth)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not delete not existing blog', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.BLOGS + '/' + makeIncorrectId(blogId))
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should delete the blog', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);

      await req
        .delete(appConfig.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
