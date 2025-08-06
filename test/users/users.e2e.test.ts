import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';
import { appConfig } from '../../src/app.config';
import { basicAuth } from '../helpers/authorization';
import { clearCollections } from '../helpers/clear-collections';

describe('Users (e2e)', () => {
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

  describe('get users', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return all users', async () => {
      const res = await req
        .get(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe('create user', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should create a user', async () => {
      const newUserDto = createUserDto({});

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.any(String),
        login: newUserDto.login,
        email: newUserDto.email,
        createdAt: expect.any(String),
      });
    });

    it('should not create a user with duplicated login', async () => {
      const newUserDto = createUserDto({ email: 'unique-email@mail.ru' });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatus.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: 'login',
            message: expect.any(String),
          },
        ],
      });
    });

    it('should not create a user with duplicated email', async () => {
      const newUserDto = createUserDto({ login: 'unique' });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatus.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: 'email',
            message: expect.any(String),
          },
        ],
      });
    });

    it('should not create a user with incorrect login', async () => {
      const invalidUserDtoMin = createUserDto({ login: 'a'.repeat(2) });
      const invalidUserDtoMax = createUserDto({ login: 'ab'.repeat(11) });
      const invalidUserDtoPattern = createUserDto({ login: '&^%$))' });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoMin)
        .expect(HttpStatus.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: 'login',
            message: expect.any(String),
          },
        ],
      });

      const res2 = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoMax)
        .expect(HttpStatus.BadRequest);

      expect(res2.body).toEqual({
        errorsMessages: [
          {
            field: 'login',
            message: expect.any(String),
          },
        ],
      });

      const res3 = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoPattern)
        .expect(HttpStatus.BadRequest);

      expect(res3.body).toEqual({
        errorsMessages: [
          {
            field: 'login',
            message: expect.any(String),
          },
        ],
      });
    });

    it('should not create a user with incorrect email', async () => {
      const invalidUserDtoPattern = createUserDto({ email: 'hello' });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoPattern)
        .expect(HttpStatus.BadRequest);

      expect(res.body).toEqual({
        errorsMessages: [
          {
            field: 'email',
            message: expect.any(String),
          },
        ],
      });
    });
  });

  describe('delete user', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    let userId = '';

    it('should not delete the user without authorization', async () => {
      const newUser = await createNewUserInDb();

      userId = newUser.id;

      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .expect(HttpStatus.Unauthorized);
    });
    it('should not delete not existing user', async () => {
      await req
        .delete(`${appConfig.MAIN_PATHS.USERS}/${makeIncorrect(userId)}`)
        .set(basicAuth)
        .expect(HttpStatus.NotFound);
    });
    it('should delete the user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatus.NoContent);

      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatus.NotFound);
    });
  });
});
