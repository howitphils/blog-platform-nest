import { appConfig } from '../../src/app.settings';

const adminCredsEncoded = Buffer.from(appConfig.ADMIN_CREDENTIALS).toString(
  'base64',
);

export const basicAuth = {
  authorization: `Basic ${adminCredsEncoded}`,
};

export const jwtAuth = (token: string) => ({
  authorization: `Bearer ${token}`,
});
