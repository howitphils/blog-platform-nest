export const appConfig = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/nest-dev-db',
  ADMIN_CREDENTIALS: 'admin:qwerty',
  IS_PUBLIC_KEY: 'isPublic',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_dev',
};
