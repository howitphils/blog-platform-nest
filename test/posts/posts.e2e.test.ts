/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { TestManager } from '../helpers/test-manager';
import { initSettings } from '../helpers/init-settings';
import { clearCollections } from '../helpers/clear-collections';
import { appConfig } from '../../src/app.config';
import { PostViewDto } from '../../src/modules/blogger-platform/posts/api/view-dto/post.view-dto';
import { PaginatedViewModel } from '../../src/core/dto/pagination-view.base';
import { basicAuth, jwtAuth } from '../helpers/authorization';
import { LikeStatuses } from '../../src/core/enums/like-statuses';
import { makeIncorrectId } from '../helpers/incorrect-id';

describe('Posts (e2e)', () => {
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

  describe('get posts with pagination', () => {
    let postsSeeds: PostViewDto[];

    beforeAll(async () => {
      postsSeeds = await testManager.createPosts(12);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return all posts with added pageSize and sortDirection', async () => {
      const { body } = (await req
        .get('/posts?pageSize=12&sortDirection=asc')
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<PostViewDto>;
      };

      expect(body).toEqual({
        page: 1,
        pagesCount: 1,
        pageSize: 12,
        totalCount: 12,
        items: postsSeeds,
      } as PaginatedViewModel<PostViewDto>);
    });

    it('should return all posts with added pageNumber', async () => {
      const { body } = (await req
        .get('/posts?pageNumber=2&sortDirection=asc')
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<PostViewDto>;
      };

      expect(body.items.length).toBe(2);
      expect(body.items[0].title).toBe('title11');
      expect(body.items[1].title).toBe('title12');
      expect(body.page).toBe(2);
      expect(body.pagesCount).toBe(2);
      expect(body.totalCount).toBe(12);
      expect(body.pageSize).toBe(10);
    });
  });

  describe('create post', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let blogId = '';

    it('should create new post', async () => {
      const blog = await testManager.createBlog();
      blogId = blog.id;

      const newPostDto = testManager.createPostDto({ blogId });

      const res = await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPostDto.title,
        shortDescription: newPostDto.shortDescription,
        content: newPostDto.content,
        blogId,
        blogName: blog.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });
    });

    it('should not create new post with incorrect input values', async () => {
      const newPostDtoMaxValues = testManager.createPostDto({
        blogId,
        content: 'a'.repeat(31),
        shortDescription: 'b'.repeat(101),
        title: 'c'.repeat(1001),
      });

      const newPostDtoEmptyValues = testManager.createPostDto({
        blogId,
        content: '',
        shortDescription: '',
        title: '',
      });

      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDtoMaxValues)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDtoEmptyValues)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create new post by unauthorized user', async () => {
      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not create new post for not existing blog', async () => {
      const newPostDto = testManager.createPostDto({
        blogId: makeIncorrectId(blogId),
      });

      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('get post by id', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let postId = '';

    it('should return a post by id', async () => {
      const postDb = await testManager.createPost();
      postId = postDb.id;

      const res = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: postDb.id,
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });
    });

    it('should not return a post by incorrect id', async () => {
      await req
        .get(appConfig.MAIN_PATHS.POSTS + '/22')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not return a not existing post', async () => {
      await req
        .get(appConfig.MAIN_PATHS.POSTS + '/' + makeIncorrectId(postId))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('update post', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let postId = '';
    let blogId = '';

    it('should update the post', async () => {
      const post = await testManager.createPost();

      postId = post.id;
      blogId = post.blogId;

      const updatedPostDto = testManager.createPostDto({
        blogId,
        content: 'new-content',
        title: 'new-title',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.NO_CONTENT);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body).toEqual({
        id: postId,
        title: updatedPostDto.title,
        content: updatedPostDto.content,
        shortDescription: post.shortDescription,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });
    });

    it('should not update the post with incorrect input values', async () => {
      const invalidPostDtoMin = testManager.createPostDto({
        blogId,
        content: '',
        shortDescription: '',
        title: '',
      });

      const invalidPostDtoMax = testManager.createPostDto({
        blogId: blogId,
        content: 'a'.repeat(31),
        title: 'b'.repeat(101),
        shortDescription: 'c'.repeat(1001),
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMin)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMax)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update the post by incorrect id', async () => {
      const updatedPostDto = testManager.createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + '/22')
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update not existing post', async () => {
      const updatedPostDto = testManager.createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + '/' + makeIncorrectId(postId))
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not update the post by unauthorized user', async () => {
      const updatedPostDto = testManager.createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .send(updatedPostDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('delete post', () => {
    let postId = '';

    beforeAll(async () => {
      const postDb = await testManager.createPost();
      postId = postDb.id;
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should not delete the post by unauthorized user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not delete the post by incorrect id', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + '/22')
        .set(basicAuth)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not delete not existing post', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + '/' + makeIncorrectId(postId))
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should delete the post', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);

      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('update post like status', () => {
    let postId: string;
    let tokens: string[];

    beforeAll(async () => {
      tokens = await testManager.getUsersTokens(3);

      postId = (await testManager.createPost()).id;
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it("should update post' dislike/like counter properly", async () => {
      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(tokens[0]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(tokens[1]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(tokens[2]))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NO_CONTENT);

      // Check the final status

      const { body } = (await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(tokens[0]))
        .expect(HttpStatus.OK)) as { body: PostViewDto };

      expect(body.extendedLikesInfo.myStatus).toBe('Dislike');
      expect(body.extendedLikesInfo.likesCount).toBe(1);
      expect(body.extendedLikesInfo.dislikesCount).toBe(2);
      expect(body.extendedLikesInfo.newestLikes.length).toBe(1);
    });

    it('should return an error for not existing post', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.POSTS +
            `/${makeIncorrectId(postId)}/like-status`,
        )
        .set(jwtAuth(tokens[0]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return an error for unauthorized user', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.POSTS +
            `/${makeIncorrectId(postId)}/like-status`,
        )
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return an error for invalid input data', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.POSTS +
            `/${makeIncorrectId(postId)}/like-status`,
        )
        .set(jwtAuth(tokens[0]))
        .send({ likeStatus: 'dislike' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
