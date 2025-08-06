import { appConfig } from '../../src/app.config';

const adminCredsEncoded = Buffer.from(appConfig.ADMIN_CREDENTIALS).toString(
  'base64',
);
export const basicAuth = {
  authorization: `Basic ${adminCredsEncoded}`,
};
