import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { LikeStatuses } from '../../src/core/enums/like-statuses';
import { jwtAuth } from '../helpers/authorization';
import { clearCollections } from '../helpers/clear-collections';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';
import { appConfig } from '../../src/app.config';

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

  describe('get comment by id', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let commentInfo: CommentInfoType;

    it('should return a comment by id', async () => {
      commentInfo = await createCommentInDb();

      const commentId = commentInfo.comment.id;

      const res = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        id: commentId,
        content: commentInfo.comment.content,
        commentatorInfo: {
          userId: commentInfo.user.id,
          userLogin: commentInfo.user.login,
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
          userId: commentInfo.user.id,
          userLogin: commentInfo.user.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: LikeStatuses.None,
        },
      });
    });
    it('should not return a comment by incorrect id', async () => {
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
        .expect(HttpStatus.NotFound);
    });
  });

  describe('get comments for a post', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let commentInfo: CommentInfoType;

    it('should return all comments for a post', async () => {
      commentInfo = await createCommentInDb();

      const res = await req
        .get(
          appConfig.MAIN_PATHS.POSTS + `/${commentInfo.postId}` + '/comments',
        )
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        ...defaultPagination,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            id: commentInfo.comment.id,
            content: commentInfo.comment.content,
            commentatorInfo: {
              userId: commentInfo.user.id,
              userLogin: commentInfo.user.login,
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: commentInfo.comment.likesInfo.likesCount,
              dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
              myStatus: commentInfo.comment.likesInfo.myStatus,
            },
          },
        ],
      });
    });

    it('should return all comments for unauthorized user', async () => {
      const res = await req
        .get(
          appConfig.MAIN_PATHS.POSTS + `/${commentInfo.postId}` + '/comments',
        )
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        ...defaultPagination,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            id: commentInfo.comment.id,
            content: commentInfo.comment.content,
            commentatorInfo: {
              userId: commentInfo.user.id,
              userLogin: commentInfo.user.login,
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: commentInfo.comment.likesInfo.likesCount,
              dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
              myStatus: LikeStatuses.None,
            },
          },
        ],
      });
    });
  });

  describe('update the comment', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let commentId = '';
    let token = '';

    it('should update the comment', async () => {
      const commentInfo = await createCommentInDb();
      const updatedCommentDto = createContentDto({
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
          userId: commentInfo.user.id,
          userLogin: commentInfo.user.login,
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
      const invalidContentDtoMin = createContentDto({
        content: 'a'.repeat(19),
      });

      const invalidContentDtoMax = createContentDto({
        content: 'a'.repeat(301),
      });

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
      const contentDto = createContentDto({
        content: 'a'.repeat(20),
      });

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .send(contentDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not update the comment by another user', async () => {
      const contentDto = createContentDto({
        content: 'a'.repeat(20),
      });

      const token2 = (await getTokenPair()).accessToken;

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .send(contentDto)
        .expect(HttpStatus.Forbidden);
    });

    it('should not update not existing comment', async () => {
      const contentDto = createContentDto({
        content: 'a'.repeat(20),
      });

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/' + makeIncorrectId(commentId))
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.NotFound);
    });

    it('should not update comment by incorrect id', async () => {
      const contentDto = createContentDto({
        content: 'a'.repeat(20),
      });

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/22')
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('delete the comment', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let commentId = '';
    let token = '';

    it('should not delete the comment by unauthorized user', async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not delete the comment by another user', async () => {
      const token2 = (await getTokenPair()).accessToken;

      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .expect(HttpStatus.Forbidden);
    });

    it('should not delete the comment by incorrect id', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + '/22')
        .set(jwtAuth(token))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should delete the comment', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.NO_CONTENT);

      await req
        .delete(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.NotFound);
    });
  });

  describe("update comment's like status", () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let commentId = '';
    let token = '';

    it('should update comment status with like', async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      const res = await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NO_CONTENT);

      expect(res.body).toEqual({});

      const commentRes = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(commentRes.body.likesInfo.myStatus).toBe('Like');
      expect(commentRes.body.likesInfo.likesCount).toBe(1);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
    });

    it('should update comment like status with dislike', async () => {
      const res = await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      expect(res.body).toEqual({});

      const commentRes = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(commentRes.body.likesInfo.myStatus).toBe('Dislike');
      expect(commentRes.body.likesInfo.likesCount).toBe(0);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    });

    it('should not update comment like status with the same status', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      const commentRes = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(commentRes.body.likesInfo.myStatus).toBe('Dislike');
      expect(commentRes.body.likesInfo.likesCount).toBe(0);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    });

    it('should return an error if like status is incorrect', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: 'Incorrect' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update comment like status for unauthorized user', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not update comment like status if comment does not exist', async () => {
      await req
        .put(
          appConfig.MAIN_PATHS.COMMENTS +
            `/${makeIncorrectId(commentId)}/like-status`,
        )
        .set(jwtAuth(token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NotFound);
    });

    it('should not update comment like status by incorrect id', async () => {
      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + '/22/like-status')
        .set(jwtAuth(token))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should update comment's dislike/like counter properly", async () => {
      const comment = await testSeeder.insertComment({});

      const tokens = await getUsersTokens(3);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${comment.id}/like-status`)
        .set(jwtAuth(tokens[0]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${comment.id}/like-status`)
        .set(jwtAuth(tokens[1]))
        .send({ likeStatus: 'Dislike' })
        .expect(HttpStatus.NO_CONTENT);

      await req
        .put(appConfig.MAIN_PATHS.COMMENTS + `/${comment.id}/like-status`)
        .set(jwtAuth(tokens[2]))
        .send({ likeStatus: 'Like' })
        .expect(HttpStatus.NO_CONTENT);

      // Check the final status
      const res = await req
        .get(appConfig.MAIN_PATHS.COMMENTS + `/${comment.id}`)
        .set(jwtAuth(tokens[0]))
        .expect(HttpStatus.OK);

      expect(res.body.likesInfo.myStatus).toBe('Dislike');
      expect(res.body.likesInfo.likesCount).toBe(1);
      expect(res.body.likesInfo.dislikesCount).toBe(2);
    });
  });
});
