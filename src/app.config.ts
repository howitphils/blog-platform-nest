export const appConfig = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/nest-dev-db',
  ADMIN_CREDENTIALS: 'admin:qwerty',
  IS_PUBLIC_KEY: 'isPublic',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_dev',
  JWT_EXPIRES_IN: '500s',
  NODEMAILER_MAIL_SERVICE: process.env.NODEMAILER_MAIL_SERVICE,
  NODEMAILER_USERNAME: process.env.NODEMAILER_USERNAME,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
};
