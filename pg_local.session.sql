CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  login varchar(50) NOT NULL,
  "passwordHash" varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  "createdAt" Date NOT NULL
)
CREATE TABLE "emailConfirmation" (
  "confirmationCode" varchar(100) NOT NULL,
  "expirationDate" Date NOT NULL,
  "isConfirmed" Boolean default false,
  "userId" int NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
)
CREATE TABLE "passwordRecovery" (
  id SERIAL PRIMARY KEY,
  "recoveryCode" varchar(100) NOT NULL,
  "expirationDate" Date NOT NULL,
  "userId" int NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
)
