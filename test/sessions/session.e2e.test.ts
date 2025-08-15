/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import { initSettings } from '../helpers/init-settings';
import { TestManager } from '../helpers/test-manager';
import { SessionViewDto } from '../../src/modules/users-accounts/application/queries/dto/session.view-dto';
import { appSettings } from '../../src/app.settings';
import { clearCollections } from '../helpers/clear-collections';

describe('/devices', () => {
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
    await clearCollections(req);
    await app.close();
  });

  let refreshTokens: string[] = [];
  let devices: SessionViewDto[];

  it('should login a user 4 times with different user-agent', async () => {
    const userDto = testManager.createUserDto({
      email: 'firstUser@test.com',
      login: 'firstUser',
    });
    await testManager.createUser(userDto);

    refreshTokens = await testManager.loginUser(
      { login: userDto.login, password: userDto.password },
      4,
    );

    expect(refreshTokens.length).toBe(4);
    for (let i = 0; i < refreshTokens.length; i++) {
      expect(refreshTokens[i]).toEqual(expect.stringContaining('.'));
    }
  });

  it('should get all sessions for specific refresh token', async () => {
    const { body } = (await req
      .get(appSettings.MAIN_PATHS.SECURITY + '/devices')
      .set('Cookie', `refreshToken=${refreshTokens[0]}`)
      .expect(HttpStatus.OK)) as { body: SessionViewDto[] };

    devices = body;

    expect(devices.length).toBe(4); // Столько раз логинился юзер

    for (let i = 0; i < devices.length; i++) {
      expect(devices[i]).toEqual({
        ip: expect.any(String),
        title: `device${i + 1}`,
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      });
    }
  });

  it('return error if session is not found', async () => {
    await req
      .delete(appSettings.MAIN_PATHS.SECURITY + '/devices/12')
      .set('Cookie', [`refreshToken=${refreshTokens[0]}`])
      .expect(HttpStatus.NOT_FOUND);
  });

  it('return error if user is trying to delete/delete all/get all sessions without authorization cookie', async () => {
    await req
      .delete(
        appSettings.MAIN_PATHS.SECURITY + `/devices/${devices[0].deviceId}`,
      )
      .expect(HttpStatus.UNAUTHORIZED);

    await req
      .delete(appSettings.MAIN_PATHS.SECURITY + '/devices')
      .expect(HttpStatus.UNAUTHORIZED);

    await req
      .get(appSettings.MAIN_PATHS.SECURITY + '/devices')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('return error if user is trying to delete session that is not his own', async () => {
    // Создаем и логиним нового юзера и потом используем его куку в запросе
    const { refreshToken } = await testManager.getTokenPair();

    await req
      .delete(
        appSettings.MAIN_PATHS.SECURITY + `/devices/${devices[0].deviceId}`,
      )
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  let newRefreshToken: string;
  it('should create new refresh token for device1', async () => {
    await testManager.delay(1000);

    const res = await req
      .post(
        appSettings.MAIN_PATHS.AUTH +
          appSettings.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN,
      )
      .set('Cookie', [`refreshToken=${refreshTokens[0]}`])
      .expect(HttpStatus.OK);

    newRefreshToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    expect(newRefreshToken).not.toBe(refreshTokens[0]);
  });

  it('should not update tokens by used refresh token', async () => {
    await req
      .post(
        appSettings.MAIN_PATHS.AUTH +
          appSettings.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN,
      )
      .set('Cookie', [`refreshToken=${refreshTokens[0]}`])
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return devices with updated lastActiveDate for device1', async () => {
    const prevActiveDate = devices[0].lastActiveDate;

    const devicesArr = await testManager.getDevices(refreshTokens[0]);

    for (let i = 0; i < devices.length; i++) {
      expect(devicesArr[i].deviceId).toBe(devices[i].deviceId);
    }

    expect(devicesArr.length).toBe(4);
    expect(devicesArr[0].lastActiveDate).not.toBe(prevActiveDate);
  });

  it('should delete device 2', async () => {
    await req
      .delete(
        appSettings.MAIN_PATHS.SECURITY + `/devices/${devices[1].deviceId}`,
      )
      .set('Cookie', `refreshToken=${refreshTokens[0]}`)
      .expect(HttpStatus.NO_CONTENT);

    const devicesArr = await testManager.getDevices(refreshTokens[0]);

    expect(devicesArr.length).toBe(3);
    expect(devicesArr[1].title).not.toBe('device2');
    expect(devicesArr[1].title).toBe('device3');
  });

  it('should logout device 3', async () => {
    await req
      .post(
        appSettings.MAIN_PATHS.AUTH + appSettings.ENDPOINT_PATHS.AUTH.LOGOUT,
      )
      .set('Cookie', `refreshToken=${refreshTokens[2]}`)
      .expect(HttpStatus.NO_CONTENT);

    const devicesArr = await testManager.getDevices(refreshTokens[0]);

    expect(devicesArr.length).toBe(2);
    expect(devicesArr[1].title).not.toBe('device3');
    expect(devicesArr[1].title).toBe('device4');
  });

  it('should not logout device by used refresh token', async () => {
    await req
      .post(
        appSettings.MAIN_PATHS.AUTH + appSettings.ENDPOINT_PATHS.AUTH.LOGOUT,
      )
      .set('Cookie', `refreshToken=${refreshTokens[2]}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should remove all devices except 1', async () => {
    await req
      .delete(appSettings.MAIN_PATHS.SECURITY + '/devices')
      .set('Cookie', `refreshToken=${refreshTokens[0]}`)
      .expect(HttpStatus.NO_CONTENT);

    const devices = await testManager.getDevices(refreshTokens[0]);

    expect(devices.length).toBe(1);
    expect(devices[0].title).toBe('device1');
  });
});
