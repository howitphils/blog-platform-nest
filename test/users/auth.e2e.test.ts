/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';
import { appConfig } from '../../src/app.config';
import { clearCollections } from '../helpers/clear-collections';
import { jwtAuth } from '../helpers/authorization';
import { ErrorsMessages } from '../../src/core/exceptions/errorsMessages';

describe('Auth (e2e)', () => {
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

  describe(appConfig.ENDPOINT_PATHS.AUTH.LOGIN, () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should login a correct user', async () => {
      const userDto = testManager.createUserDto({});
      await testManager.createUser(userDto);

      const res = await req
        .post(appConfig.MAIN_PATHS.AUTH + '/login')
        .send({
          loginOrEmail: userDto.login,
          password: userDto.password,
        })
        .expect(HttpStatus.OK);

      const cookies = res.headers['set-cookie'];

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });

      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining(appConfig.REFRESH_TOKEN_COOKIE_NAME),
        ]),
      );
    });

    it('should not login a not existing user', async () => {
      await req
        .post(appConfig.MAIN_PATHS.AUTH + '/login')
        .send({
          loginOrEmail: 'random',
          password: 'string',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not login a user with incorrect loginOrEmail', async () => {
      await req
        .post(appConfig.MAIN_PATHS.AUTH + '/login')
        .send({
          loginOrEmail: 221,
          password: '123123',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not login a user with incorrect password', async () => {
      await req
        .post(appConfig.MAIN_PATHS.AUTH + '/login')
        .send({
          loginOrEmail: 'userlogin',
          password: false,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe(appConfig.ENDPOINT_PATHS.AUTH.ME, () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it("should return user's info", async () => {
      const token = (await testManager.getTokenPair()).accessToken;

      const res = await req
        .get(appConfig.MAIN_PATHS.AUTH + '/me')
        .set(jwtAuth(token))
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        login: 'user123',
        email: 'user1234@email.com',
        userId: expect.any(String),
      });
    });

    it("should not return user's info for unauthorized user", async () => {
      await req
        .get(appConfig.MAIN_PATHS.AUTH + '/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should not return user's info if token is invalid", async () => {
      await req
        .get(appConfig.MAIN_PATHS.AUTH + '/me')
        .set(jwtAuth('invalidToken'))
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(appConfig.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY, () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return successful status even if user is not registered', async () => {
      await req
        .post(
          appConfig.MAIN_PATHS.AUTH +
            appConfig.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY,
        )
        .send({ email: 'some@email.com' })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return an error for incorrect email', async () => {
      const res = (await req
        .post(
          appConfig.MAIN_PATHS.AUTH +
            appConfig.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY,
        )
        .send({ email: 'invalid^gmail.cm' })
        .expect(HttpStatus.BAD_REQUEST)) as { body: ErrorsMessages };

      expect(res.body.errorsMessages[0].field).toBe('email');
      expect(res.body.errorsMessages[0].message).toBe('email must be an email');
    });
  });

  describe(appConfig.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY, () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return an error for incorrect password length', async () => {
      const res = (await req
        .post(
          appConfig.MAIN_PATHS.AUTH +
            appConfig.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY,
        )
        .send({ newPassword: '12345', recoveryCode: 'code' })
        .expect(HttpStatus.BAD_REQUEST)) as { body: ErrorsMessages };

      expect(res.body.errorsMessages[0].field).toBe('newPassword');
      expect(res.body.errorsMessages[0].message).toBe(
        'newPassword must be longer than or equal to 6 characters',
      );
    });

    it('should return an error for incorrect recovery code type', async () => {
      const res = (await req
        .post(
          appConfig.MAIN_PATHS.AUTH +
            appConfig.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY,
        )
        .send({ newPassword: '123456', recoveryCode: 22 })
        .expect(HttpStatus.BAD_REQUEST)) as { body: ErrorsMessages };

      expect(res.body.errorsMessages[0].field).toBe('recoveryCode');
      expect(res.body.errorsMessages[0].message).toBe(
        'recoveryCode must be a string',
      );
    });
  });
});
