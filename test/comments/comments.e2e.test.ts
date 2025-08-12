/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { LikeStatuses } from '../../src/core/enums/like-statuses';
import { jwtAuth } from '../helpers/authorization';
import { clearCollections } from '../helpers/clear-collections';
import { initSettings } from '../helpers/init-settings';
import { CommentInfoType, TestManager } from '../helpers/test-manager';
import { appConfig } from '../../src/app.settings';
import { makeIncorrectId } from '../helpers/incorrect-id';
import { CommentViewDto } from '../../src/modules/blogger-platform/comments/application/queries/dto/comment.view-dto';
import { PaginatedViewModel } from '../../src/core/dto/pagination-view.base';

describe('/comments', () => {
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

  describe('create comment for a post', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let token: string;
    let postId: string;

    it('should return a new comment', async () => {
      const userDto = testManager.createUserDto({
        email: 'zxcsad@mail.com',
        login: 'login22',
      });
      const dbPost = await testManager.createPost();

      const contentDto = testManager.createCommentInputDto();

      token = (await testManager.getTokenPair(userDto)).accessToken;
      postId = dbPost.id;

      const res = (await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${dbPost.id}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.CREATED)) as { body: CommentViewDto };

      expect(res.body).toEqual({
        id: expect.any(String),
        content: contentDto.content,
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: userDto.login,
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
      const contentDtoMin = { content: 'd'.repeat(19) };
      const contentDtoMax = { content: 'd'.repeat(301) };

      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDtoMin)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .set(jwtAuth(token))
        .send(contentDtoMax)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a new comment for unauthorized user', async () => {
      await req
        .post(appConfig.MAIN_PATHS.POSTS + `/${postId}` + '/comments')
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not create a new comment for not existing post', async () => {
      const contentDto = testManager.createCommentInputDto();

      await req
        .post(
          appConfig.MAIN_PATHS.POSTS +
            `/${makeIncorrectId(postId)}` +
            '/comments',
        )
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('get comment by id', () => {
    let commentInfo: CommentInfoType;

    beforeAll(async () => {
      const userDto = testManager.createUserDto({
        email: 'comments@email.com',
        login: 'comments',
      });

      commentInfo = await testManager.createComment(userDto);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return a comment by id', async () => {
      const commentId = commentInfo.comment.id;

      const res = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: commentId,
        content: commentInfo.comment.content,
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: commentInfo.comment.commentatorInfo.userLogin,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: commentInfo.comment.likesInfo.myStatus || 'None',
        },
      });
    });

    it('should return a comment by id for unauthorized user', async () => {
      const res = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: commentInfo.comment.id,
        content: commentInfo.comment.content,
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: expect.any(String),
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: LikeStatuses.None,
        },
      });
    });

    it('should not return a comment by incorrect id type', async () => {
      await req
        .get(appConfig.MAIN_PATHS.COMMENTS + '/22')
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not return a not existing comment', async () => {
      await req
        .get(
          appConfig.MAIN_PATHS.COMMENTS +
            '/' +
            makeIncorrectId(commentInfo.comment.id),
        )
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('get comments with pagination', () => {
    let commentsSeeds: CommentViewDto[];

    afterAll(async () => {
      await clearCollections(req);
    });

    let postId: string;

    it('should return all posts with added pageSize and sortDirection', async () => {
      const post = await testManager.createPost();

      postId = post.id;

      commentsSeeds = await testManager.createComments(12, post.id);

      const { body } = (await req
        .get(`/posts/${postId}/comments?pageSize=12&sortDirection=asc`)
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<CommentViewDto>;
      };

      expect(body).toEqual({
        page: 1,
        pagesCount: 1,
        pageSize: 12,
        totalCount: 12,
        items: commentsSeeds,
      } as PaginatedViewModel<CommentViewDto>);
    });

    it('should return all comments with added pageNumber', async () => {
      const { body } = (await req
        .get(`/posts/${postId}/comments?pageNumber=2&sortDirection=asc`)
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<CommentViewDto>;
      };

      expect(body.items.length).toBe(2);
      expect(body.items[0].content).toBe('aaaaaaaaaaaaaaaaaaaa11');
      expect(body.items[1].content).toBe('aaaaaaaaaaaaaaaaaaaa12');
      expect(body.page).toBe(2);
      expect(body.pagesCount).toBe(2);
      expect(body.totalCount).toBe(12);
      expect(body.pageSize).toBe(10);
    });
  });

  describe('update the comment', () => {
    let commentInfo: CommentInfoType;

    beforeAll(async () => {
      const userDto = testManager.createUserDto({
        email: 'comments@email.com',
        login: 'comments',
      });

      commentInfo = await testManager.createComment(userDto);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    let commentId = '';
    let token = '';

    it('should update the comment', async () => {
      const updatedCommentDto = testManager.createCommentInputDto({
        content: 'a'.repeat(21),
      });

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(updatedCommentDto)
        .expect(HttpStatus.NO_CONTENT);

      const res = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: commentId,
        content: updatedCommentDto.content,
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: commentInfo.comment.commentatorInfo.userLogin,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: commentInfo.comment.likesInfo.myStatus || 'None',
        },
      });
    });

    it('should not update the comment with incorrect body', async () => {
      const invalidContentDtoMin = {
        content: 'a'.repeat(19),
      };

      const invalidContentDtoMax = {
        content: 'a'.repeat(301),
      };

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMin)
        .expect(HttpStatus.BAD_REQUEST);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMax)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update the comment for unauthorized user', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not update the comment by another user', async () => {
      const contentDto = {
        content: 'a'.repeat(20),
      };

      const user2Dto = testManager.createUserDto({
        login: 'user222',
        email: 'new-user222@email.com',
      });

      const token2 = (await testManager.getTokenPair(user2Dto)).accessToken;

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .send(contentDto)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should not update not existing comment', async () => {
      const contentDto = {
        content: 'a'.repeat(20),
      };

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/' + makeIncorrectId(commentId))
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not update comment by incorrect id type', async () => {
      const contentDto = {
        content: 'a'.repeat(20),
      };

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/22')
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('delete the comment', () => {
    let commentInfo: CommentInfoType;

    beforeAll(async () => {
      const userDto = testManager.createUserDto({
        email: 'comments@email.com',
        login: 'comments',
      });

      commentInfo = await testManager.createComment(userDto);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should not delete the comment by unauthorized user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not delete the comment by another user', async () => {
      const userDto2 = testManager.createUserDto({
        email: 'new-user221@email.com',
        login: 'jwjwj22',
      });

      const token2 = (await testManager.getTokenPair(userDto2)).accessToken;

      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(token2))
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should not delete the comment by incorrect id type', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + '/22')
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should delete the comment', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.NO_CONTENT);

      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("update comment's like status", () => {
    let commentInfo: CommentInfoType;

    beforeAll(async () => {
      const userDto = testManager.createUserDto({
        email: 'comments@email.com',
        login: 'comments',
      });

      commentInfo = await testManager.createComment(userDto);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should update comment status with like', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${commentInfo.comment.id}/like-status`,
        )
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NO_CONTENT);

      const { body } = (await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK)) as { body: CommentViewDto };

      expect(body.likesInfo.myStatus).toBe('Like');
      expect(body.likesInfo.likesCount).toBe(1);
      expect(body.likesInfo.dislikesCount).toBe(0);
    });

    it('should update comment like status with dislike', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${commentInfo.comment.id}/like-status`,
        )
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Dislike' });

      const { body } = (await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK)) as { body: CommentViewDto };

      expect(body.likesInfo.myStatus).toBe('Dislike');
      expect(body.likesInfo.likesCount).toBe(0);
      expect(body.likesInfo.dislikesCount).toBe(1);
    });

    it('should not update comment like status with the same status', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${commentInfo.comment.id}/like-status`,
        )
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      const { body } = (await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentInfo.comment.id}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK)) as { body: CommentViewDto };

      expect(body.likesInfo.myStatus).toBe('Dislike');
      expect(body.likesInfo.likesCount).toBe(0);
      expect(body.likesInfo.dislikesCount).toBe(1);
    });

    it('should return an error if like status is incorrect', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${commentInfo.comment.id}/like-status`,
        )
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Incorrect' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update comment like status for unauthorized user', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${commentInfo.comment.id}/like-status`,
        )
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not update comment like status if comment does not exist', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${makeIncorrectId(commentInfo.comment.id)}/like-status`,
        )
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not update comment like status by incorrect id type', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/22/like-status')
        .set(jwtAuth(commentInfo.token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should update comment's dislike/like counter properly", async () => {
      const tokens = await testManager.getUsersTokens(3);

      const {
        comment: { id },
      } = await testManager.createComment({
        email: 'hhhhh@mail.com',
        login: 'zzzz',
        password: '1234566',
      });

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${id}/like-status`)
        .set(jwtAuth(tokens[0]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${id}/like-status`)
        .set(jwtAuth(tokens[1]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${id}/like-status`)
        .set(jwtAuth(tokens[2]))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NO_CONTENT);

      // Check the final status

      const { body } = (await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${id}`)
        .set(jwtAuth(tokens[0]))
        .expect(HttpStatus.OK)) as { body: CommentViewDto };

      expect(body.likesInfo.myStatus).toBe('Dislike');
      expect(body.likesInfo.likesCount).toBe(1);
      expect(body.likesInfo.dislikesCount).toBe(2);
    });
  });
});
