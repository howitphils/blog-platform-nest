import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { TestManager } from '../helpers/test-manager';
import { initSettings } from '../helpers/init-settings';
import { clearCollections } from '../helpers/clear-collections';
import { appConfig } from '../../src/app.config';
import { PostViewDto } from '../../src/modules/blogger-platform/posts/api/view-dto/post.view-dto';
import { PaginatedViewModel } from '../../src/core/dto/pagination-view.base';

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
      postsSeeds = await testManager.createBlogs(12);
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

    it('should return all posts with added pageNumber and sorting by name', async () => {
      const { body } = (await req
        .get('/posts?sortBy=name&pageNumber=2&sortDirection=asc')
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<PostViewDto>;
      };

      expect(body.items.length).toBe(2);
      expect(body.items[0].title).toBe('blog8');
      expect(body.items[1].title).toBe('blog9');
      expect(body.page).toBe(2);
      expect(body.pagesCount).toBe(2);
      expect(body.totalCount).toBe(12);
      expect(body.pageSize).toBe(10);
    });
  });

  describe('get comments for a post', () => {
    afterAll(async () => {
      await clearCollections();
    });

    it('should return all comments for a post', async () => {
      const dbPost = await createPostInDbHelper();

      const res = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${dbPost.id}` + '/comments')
        .expect(HttpStatus.OK);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe('create comment for a post', () => {
    afterAll(async () => {
      await clearCollections();
    });

    let token = '';
    let postId = '';

    it('should return a new comment', async () => {
      const userDto = createUserDto({});
      const dbUser = await createNewUserInDb(userDto);
      const dbPost = await createPostInDbHelper();
      const contentDto = createContentDto({});

      token = (await getTokenPair(userDto)).accessToken;

      postId = dbPost.id;

      const res = await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        content: contentDto.content,
        commentatorInfo: {
          userId: dbUser.id,
          userLogin: dbUser.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
        },
      });
    });

    it('should not create a new comment with incorrect body', async () => {
      const contentDtoMin = createContentDto({ content: 'd'.repeat(19) });
      const contentDtoMax = createContentDto({ content: 'd'.repeat(301) });

      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDtoMin)
        .expect(HttpStatus.BadRequest);

      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDtoMax)
        .expect(HttpStatus.BadRequest);
    });

    it('should not create a new comment for unauthorized user', async () => {
      const contentDto = createContentDto({});

      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .send(contentDto)
        .expect(HttpStatus.Unauthorized);
    });

    it('should not create a new comment for not existing post', async () => {
      const contentDto = createContentDto({});

      await req
        .post(
          appConfig.MAIN_PATHS.POSTS +
            `/${makeIncorrect(postId)}` +
            '/comments',
        )
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.NotFound);
    });
  });

  describe('create post', () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = '';
    it('should create new post', async () => {
      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;

      const newPostDto = createPostDto({ blogId });

      const res = await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatus.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPostDto.title,
        shortDescription: newPostDto.shortDescription,
        content: newPostDto.content,
        blogId: blogDb.id,
        blogName: blogDb.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });

      const postsRes = await req
        .get(appConfig.MAIN_PATHS.POSTS)
        .expect(HttpStatus.OK);

      expect(postsRes.body.items.length).toBe(1);
    });

    it('should not create new post with incorrect input values', async () => {
      const newPostDto = createPostDto({
        blogId: blogId,
        content: 'a'.repeat(31),
        shortDescription: 'b'.repeat(101),
        title: 'c'.repeat(1001),
      });

      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatus.BadRequest);
    });

    it('should not create new post by unauthorized user', async () => {
      const newPostDto = createPostDto({ blogId });

      await req
        .post(appConfig.MAIN_PATHS.POSTS)
        .send(newPostDto)
        .expect(HttpStatus.Unauthorized);
    });
  });

  describe('get post by id', () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = '';

    it('should return a post by id', async () => {
      const postDb = await createPostInDbHelper();
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
        .expect(HttpStatus.BadRequest);
    });

    it('should not return a not existing post', async () => {
      await req
        .get(appConfig.MAIN_PATHS.POSTS + '/' + makeIncorrect(postId))
        .expect(HttpStatus.NotFound);
    });
  });

  describe('update post', () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = '';
    let blogId = '';

    it('should update the post', async () => {
      const postDb = await createPostInDbHelper();

      postId = postDb.id;
      blogId = postDb.blogId;

      const updatedPostDto = createPostDto({
        blogId: postDb.blogId,
        content: 'new-content',
        title: 'new-title',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body).toEqual({
        id: postDb.id,
        title: updatedPostDto.title,
        content: updatedPostDto.content,
        shortDescription: postDb.shortDescription,
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

    it('should not update the post with incorrect input values', async () => {
      const invalidPostDtoMin = createPostDto({
        blogId: blogId,
        content: '',
        title: '',
        shortDescription: '',
      });

      const invalidPostDtoMax = createPostDto({
        blogId: blogId,
        content: 'a'.repeat(31),
        title: 'b'.repeat(101),
        shortDescription: 'c'.repeat(1001),
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMin)
        .expect(HttpStatus.BadRequest);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMax)
        .expect(HttpStatus.BadRequest);
    });

    it('should not update the post by incorrect id', async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + '/22')
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.BadRequest);
    });
    it('should not update not existing post', async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId.slice(0, -2) + 'bc'}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatus.NotFound);
    });

    it('should not update the post by unauthorized user', async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: 'new',
        title: 'new',
      });

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .send(updatedPostDto)
        .expect(HttpStatus.Unauthorized);
    });
  });

  describe('delete post', () => {
    let postId = '';

    beforeAll(async () => {
      const postDb = await createPostInDbHelper();
      postId = postDb.id;
    });

    afterAll(async () => {
      await clearCollections();
    });

    it('should not delete the post by unauthorized user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should not delete the post by incorrect id', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + '/22')
        .set(basicAuth)
        .expect(HttpStatus.BadRequest);
    });

    it('should delete the post', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatus.NoContent);

      await req
        .delete(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatus.NotFound);
    });
  });

  describe("update post's like status", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = '';
    let token = '';

    it('should create like for post', async () => {
      const userDto = createUserDto({
        email: 'user1@gmail.com',
        login: 'user1login',
      });
      const dbUser = await createNewUserInDb(userDto);
      const postDb = await createPostInDbHelper();
      token = (await getTokenPair(userDto)).accessToken;

      postId = postDb.id;

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Like })
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body).toEqual({
        id: expect.any(String),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 1,
          myStatus: LikeStatuses.Like,
          newestLikes: [
            {
              addedAt: expect.any(String),
              userId: dbUser.id,
              login: dbUser.login,
            },
          ],
        },
      });
    });

    it('should change post like status to dislike', async () => {
      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Dislike })
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body.extendedLikesInfo).toEqual({
        dislikesCount: 1,
        likesCount: 0,
        myStatus: LikeStatuses.Dislike,
        newestLikes: [],
      });
    });

    it('should not change post like status with the same like status in request', async () => {
      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Dislike })
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body.extendedLikesInfo).toEqual({
        dislikesCount: 1,
        likesCount: 0,
        myStatus: LikeStatuses.Dislike,
        newestLikes: [],
      });
    });

    it('should change post like status to none', async () => {
      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.None })
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body.extendedLikesInfo).toEqual({
        dislikesCount: 0,
        likesCount: 0,
        myStatus: LikeStatuses.None,
        newestLikes: [],
      });
    });

    it('should properly change like status and sort newest likes for different users ', async () => {
      const usersTokens = await getUsersTokens(3);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(usersTokens[0]))
        .send({ likeStatus: LikeStatuses.Like })
        .expect(HttpStatus.NoContent);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(usersTokens[1]))
        .send({ likeStatus: LikeStatuses.Dislike })
        .expect(HttpStatus.NoContent);

      await req
        .put(appConfig.MAIN_PATHS.POSTS + `/${postId}/like-status`)
        .set(jwtAuth(usersTokens[2]))
        .send({ likeStatus: LikeStatuses.Like })
        .expect(HttpStatus.NoContent);

      const updatedPostRes = await req
        .get(appConfig.MAIN_PATHS.POSTS + `/${postId}`)
        .set(jwtAuth(usersTokens[0]))
        .expect(HttpStatus.OK);

      expect(updatedPostRes.body.extendedLikesInfo).toEqual({
        dislikesCount: 1,
        likesCount: 2,
        myStatus: LikeStatuses.Like,
        newestLikes: [
          {
            addedAt: expect.any(String),
            userId: expect.any(String),
            login: 'userlogin3',
          },
          {
            addedAt: expect.any(String),
            userId: expect.any(String),
            login: 'userlogin1',
          },
        ],
      });
    });
  });
});
