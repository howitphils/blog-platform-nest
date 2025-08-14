const adminCredsEncoded = Buffer.from('admin:qwerty').toString('base64');

export const basicAuth = {
  authorization: `Basic ${adminCredsEncoded}`,
};

export const jwtAuth = (token: string) => ({
  authorization: `Bearer ${token}`,
});
