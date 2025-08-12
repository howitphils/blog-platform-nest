/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';
import { appConfig } from '../../src/app.settings';
import { basicAuth } from '../helpers/authorization';
import { clearCollections } from '../helpers/clear-collections';
import { makeIncorrectId } from '../helpers/incorrect-id';
import { UserViewDto } from '../../src/modules/users-accounts/application/queries/dto/user.view-dto';
import { PaginatedViewModel } from '../../src/core/dto/pagination-view.base';

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

  describe('get users with pagination', () => {
    let usersSeeds: UserViewDto[];

    beforeAll(async () => {
      usersSeeds = await testManager.createUsers(12);
    });

    afterAll(async () => {
      await clearCollections(req);
    });

    it('should return all users with added pageSize and sortDirection', async () => {
      const { body } = (await req
        .get('/users?pageSize=12&sortDirection=asc')
        .set(basicAuth)
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<UserViewDto>;
      };

      expect(body).toEqual({
        page: 1,
        pagesCount: 1,
        pageSize: 12,
        totalCount: 12,
        items: usersSeeds,
      } as PaginatedViewModel<UserViewDto>);
    });

    it('should return all users with added searchLoginTerm and sorting by login', async () => {
      const { body } = (await req
        .get('/users?searchLoginTerm=1&sortBy=login&sortDirection=asc')
        .set(basicAuth)
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<UserViewDto>;
      };

      expect(body.page).toBe(1);
      expect(body.totalCount).toBe(4);
      expect(body.pageSize).toBe(10);
      expect(body.pagesCount).toBe(1);
      expect(body.items.length).toBe(4);
      expect(body.items[0].login).toBe('user1');
      expect(body.items[body.items.length - 1].login).toBe('user12');
    });

    it('should return all users with added searchEmailTerm and sorting by email', async () => {
      const { body } = (await req
        .get('/users?searchEmailTerm=1&sortBy=email&sortDirection=asc')
        .set(basicAuth)
        .expect(HttpStatus.OK)) as {
        body: PaginatedViewModel<UserViewDto>;
      };

      expect(body.page).toBe(1);
      expect(body.totalCount).toBe(4);
      expect(body.pageSize).toBe(10);
      expect(body.pagesCount).toBe(1);
      expect(body.items.length).toBe(4);
    });
  });

  describe('create user', () => {
    afterAll(async () => {
      await clearCollections(req);
    });

    it('should create a user', async () => {
      const newUserDto = testManager.createUserDto({});

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto);
      console.log(res.body);

      expect(res.status).toBe(HttpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.any(String),
        login: newUserDto.login,
        email: newUserDto.email,
        createdAt: expect.any(String),
      });
    });

    it('should not create a user with duplicated login', async () => {
      const newUserDto = testManager.createUserDto({
        email: 'unique-email@mail.ru',
      });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatus.BAD_REQUEST);

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
      const newUserDto = testManager.createUserDto({ login: 'unique' });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(newUserDto)
        .expect(HttpStatus.BAD_REQUEST);

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
      const invalidUserDtoMin = testManager.createUserDto({
        login: 'a'.repeat(2),
        email: 'email2@mail.com',
      });
      const invalidUserDtoMax = testManager.createUserDto({
        login: 'ab'.repeat(11),
        email: 'email2@mail.com',
      });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoMin)
        .expect(HttpStatus.BAD_REQUEST);

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
        .expect(HttpStatus.BAD_REQUEST);

      expect(res2.body).toEqual({
        errorsMessages: [
          {
            field: 'login',
            message: expect.any(String),
          },
        ],
      });
    });

    it('should not create a user with incorrect email', async () => {
      const invalidUserDtoPattern = testManager.createUserDto({
        email: 'hello',
      });

      const res = await req
        .post(appConfig.MAIN_PATHS.USERS)
        .set(basicAuth)
        .send(invalidUserDtoPattern)
        .expect(HttpStatus.BAD_REQUEST);

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
      const newUser = await testManager.createUser();

      userId = newUser.id;

      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not delete not existing user', async () => {
      await req
        .delete(`${appConfig.MAIN_PATHS.USERS}/${makeIncorrectId(userId)}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not delete user with invalid id type', async () => {
      await req
        .delete(`${appConfig.MAIN_PATHS.USERS}/22`)
        .set(basicAuth)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should delete the user', async () => {
      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);

      await req
        .delete(appConfig.MAIN_PATHS.USERS + `/${userId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
